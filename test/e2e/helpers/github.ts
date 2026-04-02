import type { Page } from '@playwright/test';

const GITHUB_API = 'https://api.github.com/**';

const mockedRepoResponses = {
  'danphenderson/BlockOpt.jl': {
    id: 2,
    name: 'BlockOpt.jl',
    full_name: 'danphenderson/BlockOpt.jl',
    html_url: 'https://github.com/danphenderson/BlockOpt.jl',
    stargazers_count: 3,
    fork: false,
    archived: false,
  },
  'microsoft/playwright': {
    id: 100,
    name: 'playwright',
    full_name: 'microsoft/playwright',
    html_url: 'https://github.com/microsoft/playwright',
    stargazers_count: 50000,
    fork: false,
    archived: false,
  },
} as const;

/** Mock the GitHub request graph used by githubProfileData.ts. */
export async function mockGitHubAPISuccess(page: Page) {
  await page.route('**/api.github.com/users/*/events/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '1',
          type: 'PushEvent',
          repo: { name: 'danphenderson/dev-danhenderson' },
          payload: {
            ref: 'refs/heads/main',
            before: 'abc',
            head: 'def',
            commits: [{ message: 'E2E mock commit', sha: 'abc123' }],
          },
        },
        {
          id: '2',
          type: 'PullRequestEvent',
          repo: { name: 'danphenderson/BlockOpt.jl' },
          payload: {
            action: 'opened',
            pull_request: {
              number: 42,
              html_url: 'https://github.com/danphenderson/BlockOpt.jl/pull/42',
            },
          },
        },
      ]),
    })
  );

  await page.route('**/api.github.com/search/issues**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_count: 1,
        items: [
          {
            repository_url: 'https://api.github.com/repos/microsoft/playwright',
          },
        ],
      }),
    })
  );

  await page.route('**/api.github.com/repos/**', (route) => {
    const repoName = new URL(route.request().url()).pathname.split('/repos/')[1];
    const mockedRepo = mockedRepoResponses[repoName as keyof typeof mockedRepoResponses];

    if (!mockedRepo) {
      return route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockedRepo),
    });
  });
}

/** Mock all GitHub API routes to return server errors so fallback content appears. */
export async function mockGitHubAPIFailure(page: Page) {
  await page.route(GITHUB_API, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );
}

/** Mock GitHub events as successful but contribution search as failed for partial-fallback testing. */
export async function mockGitHubAPIPartialFailure(page: Page) {
  await page.route('**/api.github.com/users/*/events/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '1',
          type: 'PushEvent',
          repo: { name: 'danphenderson/dev-danhenderson' },
          payload: {
            ref: 'refs/heads/main',
            before: 'abc',
            head: 'def',
            commits: [{ message: 'E2E mock commit', sha: 'abc123' }],
          },
        },
      ]),
    })
  );

  await page.route('**/api.github.com/search/issues**', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );

  await page.route('**/api.github.com/repos/**', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );
}
