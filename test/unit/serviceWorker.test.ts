import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

// Minimal fetch-response boundary; browser smoke tests exercise real Response/Cache objects.
class Response {
  readonly status: number;
  readonly ok: boolean;
  constructor(
    private body: string | Uint8Array,
    options: { status?: number } = {}
  ) {
    this.status = options.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
  }
  clone() {
    return new Response(this.body, { status: this.status });
  }
  async blob() {
    return {
      size: typeof this.body === 'string' ? Buffer.byteLength(this.body) : this.body.byteLength,
    };
  }
  async text() {
    return typeof this.body === 'string' ? this.body : Buffer.from(this.body).toString();
  }
}

const source = readFileSync(resolve(__dirname, '../../public/service-worker.js'), 'utf8');
const origin = 'https://portfolio.example';

type RequestKey = string | { url: string };
const keyOf = (request: RequestKey) => (typeof request === 'string' ? request : request.url);

const workerHarness = () => {
  const stores = new Map<string, Map<string, Response>>();
  const listeners: Record<string, (event: any) => void> = {};
  let failWrites = false;
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name)!;
      return {
        put: async (key: RequestKey, response: Response) => {
          if (failWrites) throw new Error('Quota exceeded');
          entries.set(keyOf(key), response);
        },
        keys: async () => [...entries.keys()].map((url) => ({ url })),
        delete: async (key: RequestKey) => entries.delete(keyOf(key)),
      };
    },
    match: async (key: RequestKey) => {
      for (const entries of stores.values()) {
        const match = entries.get(keyOf(key));
        if (match) return match.clone();
      }
      return undefined;
    },
  };
  const fetch = jest.fn(async () => new Response('display-image', { status: 200 }));
  runInNewContext(source, {
    self: {
      location: new URL(`${origin}/portfolio/service-worker.js`),
      addEventListener: (name: string, listener: any) => {
        listeners[name] = listener;
      },
      clients: { claim: async () => {} },
    },
    caches,
    fetch,
    URL,
    Response,
  });
  const requestImage = (path: string) => {
    let result: Promise<Response> | undefined;
    listeners.fetch({
      request: { url: `${origin}${path}`, method: 'GET', mode: 'cors', destination: 'image' },
      respondWith: (promise: Promise<Response>) => {
        result = promise;
      },
    });
    return result!;
  };
  return {
    stores,
    fetch,
    requestImage,
    failWrites: () => {
      failWrites = true;
    },
  };
};

describe('service worker image storage', () => {
  it('bounds concurrent display-image cache writes to 48 entries', async () => {
    const harness = workerHarness();
    const responses = await Promise.all(
      Array.from({ length: 60 }, (_, index) =>
        harness.requestImage(`/portfolio/assets/display/photo-${index}.webp`)
      )
    );
    expect(responses.every((response) => response.ok)).toBe(true);
    const cached = [...harness.stores.values()].flatMap((store) => [...store.keys()]);
    expect(cached).toHaveLength(48);
    expect(cached).not.toContain(`${origin}/portfolio/assets/display/photo-0.webp`);
    expect(cached).toContain(`${origin}/portfolio/assets/display/photo-59.webp`);
  });

  it('does not cache original photographs, query duplicates, or oversized display files', async () => {
    const harness = workerHarness();
    await harness.requestImage('/portfolio/assets/photography/original.jpg');
    await harness.requestImage('/portfolio/assets/display/photo.webp?w=100');
    harness.fetch.mockImplementationOnce(async () => new Response(new Uint8Array(1_000_001)));
    await harness.requestImage('/portfolio/assets/display/large.webp');
    expect([...harness.stores.values()].every((store) => store.size === 0)).toBe(true);
  });

  it('preserves a successful response when storage fails', async () => {
    const harness = workerHarness();
    harness.failWrites();
    const response = await harness.requestImage('/portfolio/assets/display/photo.webp');
    expect(response.ok).toBe(true);
    expect(await response.text()).toBe('display-image');
  });

  it('refreshes the same URL online and falls back to its latest cached body offline', async () => {
    const harness = workerHarness();
    const path = '/portfolio/assets/display/photo.webp';
    await harness.requestImage(path);
    harness.fetch.mockImplementationOnce(async () => new Response('updated-image'));
    expect(await (await harness.requestImage(path)).text()).toBe('updated-image');
    harness.fetch.mockRejectedValueOnce(new Error('Offline'));
    expect(await (await harness.requestImage(path)).text()).toBe('updated-image');
  });
});
