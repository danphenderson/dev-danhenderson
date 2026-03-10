import { renderHook, waitFor } from '@testing-library/react';
import { useGithubProfile } from './useGithubProfile';

const fallbackActivity = [
  { label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).', href: 'https://github.com/danphenderson/BlockOpt.jl' },
];
const fallbackProjects = [
  { name: 'BlockOpt.jl', url: 'https://github.com/danphenderson/BlockOpt.jl' },
];
const fallbackContributions = [
  { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright' },
];

jest.mock('../data/cv', () => ({
  githubUsername: 'testuser',
  fallbackGitHubActivity: [
    { label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).', href: 'https://github.com/danphenderson/BlockOpt.jl' },
  ],
  fallbackGitHubProjects: [
    { name: 'BlockOpt.jl', url: 'https://github.com/danphenderson/BlockOpt.jl' },
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
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns fallback data initially', () => {
    global.fetch = jest.fn(() => new Promise<Response>(() => {}));

    const { result } = renderHook(() => useGithubProfile());

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.projects).toEqual(fallbackProjects);
    expect(result.current.contributions).toEqual(fallbackContributions);
    expect(result.current.error).toBeNull();
  });

  it('fetches and updates data on mount', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => createOkResponse([]))
      .mockImplementationOnce(() =>
        createOkResponse([
          { id: 1, name: 'my-repo', html_url: 'https://github.com/testuser/my-repo', stargazers_count: 5, fork: false, archived: false },
        ])
      )
      .mockImplementationOnce(() => createOkResponse({ items: [] }));

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(result.current.projects).toEqual([
      { name: 'my-repo', url: 'https://github.com/testuser/my-repo' },
    ]);
  });

  it('falls back gracefully on fetch failure', async () => {
    global.fetch = jest.fn()
      .mockImplementationOnce(() => createErrorResponse())
      .mockImplementationOnce(() => createErrorResponse())
      .mockImplementationOnce(() => createErrorResponse());

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.projects).toEqual(fallbackProjects);
    expect(result.current.error).toBeTruthy();
  });

  it('falls back gracefully on network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGithubProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activity).toEqual(fallbackActivity);
    expect(result.current.projects).toEqual(fallbackProjects);
    expect(result.current.contributions).toEqual(fallbackContributions);
    expect(result.current.error).toBeTruthy();
  });
});
