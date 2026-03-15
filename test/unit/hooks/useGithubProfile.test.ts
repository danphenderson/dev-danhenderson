import { renderHook, waitFor } from '@testing-library/react';
import { useGithubProfile } from '../../../src/hooks/useGithubProfile';
import { resetGitHubProfileDataCacheForTests } from '../../../src/hooks/githubProfileData';

const fallbackActivity = [
  {
    label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).',
    href: 'https://github.com/danphenderson/BlockOpt.jl',
  },
];
const fallbackContributions = [
  { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright' },
];

jest.mock('../../../src/data/cv', () => ({
  githubUsername: 'testuser',
  fallbackGitHubActivity: [
    {
      label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).',
      href: 'https://github.com/danphenderson/BlockOpt.jl',
    },
  ],
  fallbackGitHubContributions: [
    { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright' },
  ],
  MAX_VISIBLE_CONTRIBUTIONS: 20,
  MAX_CONTRIBUTION_ENRICHMENTS: 8,
}));

const createOkResponse = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

const createErrorResponse = () =>
  Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) } as Response);

describe('useGithubProfile', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    resetGitHubProfileDataCacheForTests();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns fallback data initially', () => {
    global.fetch = jest.fn(() => new Promise<Response>(() => {}));

    const { result } = renderHook(() => useGithubProfile());

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.contributions).toEqual(fallbackContributions);
    expect(result.current.error).toBeNull();
    expect(result.current.status).toMatchObject({
      source: 'static',
      isFallback: true,
      reason: 'initial-fallback',
    });
  });

  it('fetches and updates activity on mount', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        createOkResponse([
          {
            id: 'event-1',
            type: 'PushEvent',
            repo: { name: 'testuser/my-repo' },
            payload: { commits: [{ sha: 'abc123' }], head: 'abc123' },
          },
        ])
      )
      .mockImplementationOnce(() => createOkResponse({ items: [] }));

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.current.activity).toEqual([
      {
        label: 'Pushed 1 commit to testuser/my-repo',
        href: 'https://github.com/testuser/my-repo/commit/abc123',
      },
    ]);
    expect(result.current.status).toMatchObject({
      source: 'remote',
      isFallback: true,
      reason: 'fallback-content',
    });
    expect(result.current.status.freshness.lastUpdated).toEqual(expect.any(String));
  });

  it('falls back gracefully on fetch failure', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => createErrorResponse())
      .mockImplementationOnce(() => createErrorResponse());

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.error).toBeTruthy();
    expect(result.current.status).toMatchObject({
      source: 'remote',
      isFallback: true,
      reason: 'fallback-content',
    });
  });

  it('falls back gracefully on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.contributions).toEqual(fallbackContributions);
    expect(result.current.error).toBeTruthy();
    expect(result.current.status).toMatchObject({
      source: 'remote',
      isFallback: true,
      reason: 'fallback-content',
    });
  });

  it('reuses cached GitHub data across hook mounts', async () => {
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        createOkResponse([
          {
            id: 'event-1',
            type: 'PushEvent',
            repo: { name: 'testuser/my-repo' },
            payload: { commits: [{ sha: 'abc123' }], head: 'abc123' },
          },
        ])
      )
      .mockImplementationOnce(() => createOkResponse({ items: [] }));

    const firstHook = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(firstHook.result.current.loading).toBe(false);
    });

    const secondHook = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(secondHook.result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(secondHook.result.current.status).toMatchObject({
      source: 'cache',
      reason: 'cache-hit',
      isFallback: true,
    });
  });
});
