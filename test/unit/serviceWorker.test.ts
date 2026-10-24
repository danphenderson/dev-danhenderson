import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

// Minimal fetch-response boundary; browser smoke tests exercise real Response/Cache objects.
class Response {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: { get: (name: string) => string | null };
  constructor(
    private body: string | Uint8Array,
    private options: { status?: number; headers?: Record<string, string> } = {}
  ) {
    this.status = options.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    const headers = new Map(
      Object.entries(options.headers ?? { 'Content-Type': 'image/webp' }).map(([name, value]) => [
        name.toLowerCase(),
        value,
      ])
    );
    this.headers = { get: (name) => headers.get(name.toLowerCase()) ?? null };
  }
  clone() {
    return new Response(this.body, this.options);
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
  const lifetimes: Promise<unknown>[] = [];
  let failWrites = false;
  let writeGate: Promise<void> | undefined;
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (name: string) => stores.delete(name),
    open: async (name: string) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name)!;
      return {
        put: async (key: RequestKey, response: Response) => {
          if (failWrites) throw new Error('Quota exceeded');
          await writeGate;
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
  const request = (
    path: string,
    options: { mode?: string; destination?: string; range?: string } = {}
  ) => {
    let result: Promise<Response> | undefined;
    const request = {
      url: new URL(path, origin).href,
      method: 'GET',
      mode: options.mode ?? 'cors',
      destination: options.destination ?? 'image',
      headers: { has: (name: string) => name.toLowerCase() === 'range' && Boolean(options.range) },
    };
    listeners.fetch({
      request,
      respondWith: (promise: Promise<Response>) => {
        result = promise;
      },
      waitUntil: (promise: Promise<unknown>) => {
        lifetimes.push(promise);
      },
    });
    return result ?? fetch();
  };
  return {
    stores,
    fetch,
    request,
    requestImage: (path: string) => request(path),
    // Resolves once every write the worker extended its lifetime for has finished.
    settleWrites: () => Promise.all(lifetimes),
    holdWrites: (gate: Promise<void>) => {
      writeGate = gate;
    },
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
    await harness.settleWrites();
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
    await harness.settleWrites();
    expect([...harness.stores.values()].every((store) => store.size === 0)).toBe(true);
  });

  it('preserves a successful response when storage fails', async () => {
    const harness = workerHarness();
    harness.failWrites();
    const response = await harness.requestImage('/portfolio/assets/display/photo.webp');
    expect(response.ok).toBe(true);
    expect(await response.text()).toBe('display-image');
    await harness.settleWrites();
  });

  it('responds before cache writes finish and keeps the worker alive until they do', async () => {
    const harness = workerHarness();
    const cachedUrls = () => [...harness.stores.values()].flatMap((store) => [...store.keys()]);
    let releaseWrites!: () => void;
    harness.holdWrites(
      new Promise<void>((resolve) => {
        releaseWrites = resolve;
      })
    );
    const response = await harness.requestImage('/portfolio/assets/display/photo.webp');
    expect(await response.text()).toBe('display-image');
    expect(cachedUrls()).toEqual([]);
    releaseWrites();
    await harness.settleWrites();
    expect(cachedUrls()).toEqual([`${origin}/portfolio/assets/display/photo.webp`]);
  });

  it('refreshes the same URL online and falls back to its latest cached body offline', async () => {
    const harness = workerHarness();
    const path = '/portfolio/assets/display/photo.webp';
    await harness.requestImage(path);
    harness.fetch.mockImplementationOnce(async () => new Response('updated-image'));
    expect(await (await harness.requestImage(path)).text()).toBe('updated-image');
    await harness.settleWrites();
    harness.fetch.mockRejectedValueOnce(new Error('Offline'));
    expect(await (await harness.requestImage(path)).text()).toBe('updated-image');
  });

  it('uses a cached image instead of a successful HTML rewrite and does not cache the rewrite', async () => {
    const harness = workerHarness();
    const path = '/portfolio/assets/display/photo.webp';
    await harness.requestImage(path);
    await harness.settleWrites();
    harness.fetch.mockResolvedValueOnce(
      new Response('<!doctype html>', { headers: { 'Content-Type': 'text/html' } })
    );
    expect(await (await harness.requestImage(path)).text()).toBe('display-image');
    await harness.settleWrites();
    harness.fetch.mockRejectedValueOnce(new Error('Offline'));
    expect(await (await harness.requestImage(path)).text()).toBe('display-image');
  });

  it('rejects HTML masquerading as an image when no usable cache exists', async () => {
    const harness = workerHarness();
    const path = '/portfolio/assets/display/photo.webp';
    harness.stores.set('danhenderson-v3-display-images', new Map([
      [`${origin}${path}`, new Response('<html>cached</html>', {
        headers: { 'Content-Type': 'text/html' },
      })],
    ]));
    harness.fetch.mockResolvedValueOnce(
      new Response('<html>rewritten</html>', { headers: { 'Content-Type': 'text/html' } })
    );
    const response = await harness.requestImage(path);
    expect(response.status).toBe(502);
    expect(await response.text()).toBe('Invalid image response');
    harness.fetch.mockRejectedValueOnce(new Error('Offline'));
    expect((await harness.requestImage(path)).status).toBe(503);
  });
});

describe('service worker navigation boundaries', () => {
  const navigate = { mode: 'navigate', destination: 'document' };
  const seedShell = (harness: ReturnType<typeof workerHarness>) =>
    harness.stores.set('danhenderson-v3', new Map([
      ['./index.html', new Response('<html>app shell</html>', {
        headers: { 'Content-Type': 'text/html' },
      })],
    ]));

  it.each(['/portfolio/cv', '/portfolio/photography/landscape', '/portfolio/blog/unknown-post'])(
    'preserves app-shell recovery for %s',
    async (path) => {
      const harness = workerHarness();
      seedShell(harness);
      harness.fetch.mockResolvedValueOnce(new Response('Not found', { status: 404 }));
      expect(await (await harness.request(path, navigate)).text()).toBe('<html>app shell</html>');
    }
  );

  it.each([
    '/portfolio/assets/aws-soln-architect-cert.pdf',
    '/portfolio/assets/aws-cloud-practitioner-cert.pdf',
    '/portfolio/assets/daniel-henderson-resume.pdf',
    '/portfolio/assets/display/missing.webp',
    '/portfolio/assets/missing',
    '/portfolio/service-worker.js',
    '/elsewhere/cv',
    'https://other.example/cv',
  ])('never replaces a failed file or out-of-scope navigation with HTML: %s', async (path) => {
    const harness = workerHarness();
    seedShell(harness);
    harness.fetch.mockResolvedValueOnce(new Response('Not found', { status: 404 }));
    const response = await harness.request(path, navigate);
    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not found');
  });

  it('leaves PDF range responses intact and does not cache partial content', async () => {
    const harness = workerHarness();
    const partial = new Response('%PDF-', {
      status: 206,
      headers: { 'Content-Type': 'application/pdf', 'Content-Range': 'bytes 0-4/100' },
    });
    harness.fetch.mockResolvedValueOnce(partial);
    const response = await harness.request('/portfolio/assets/daniel-henderson-resume.pdf', {
      ...navigate,
      range: 'bytes=0-4',
    });
    expect(response).toBe(partial);
    expect(response.headers.get('Content-Range')).toBe('bytes 0-4/100');
    await harness.settleWrites();
    expect(harness.stores.size).toBe(0);
  });

  it('does not turn an offline PDF failure into a successful HTML download', async () => {
    const harness = workerHarness();
    seedShell(harness);
    harness.fetch.mockRejectedValueOnce(new Error('Offline'));
    await expect(harness.request('/portfolio/assets/resume.pdf', navigate)).rejects.toThrow('Offline');
  });
});
