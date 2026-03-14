import type { Page } from '@playwright/test';

const GITHUB_API = 'https://api.github.com/**';

/** Mock all GitHub API routes to return successful, deterministic responses. */
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

  await page.route('**/api.github.com/users/*/repos**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          name: 'dev-danhenderson',
          full_name: 'danphenderson/dev-danhenderson',
          html_url: 'https://github.com/danphenderson/dev-danhenderson',
          stargazers_count: 5,
          fork: false,
          archived: false,
        },
        {
          id: 2,
          name: 'BlockOpt.jl',
          full_name: 'danphenderson/BlockOpt.jl',
          html_url: 'https://github.com/danphenderson/BlockOpt.jl',
          stargazers_count: 3,
          fork: false,
          archived: false,
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

  await page.route('**/api.github.com/repos/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 100,
        name: 'playwright',
        full_name: 'microsoft/playwright',
        html_url: 'https://github.com/microsoft/playwright',
        stargazers_count: 50000,
        fork: false,
        archived: false,
      }),
    })
  );
}

/** Mock all GitHub API routes to return server errors so fallback content appears. */
export async function mockGitHubAPIFailure(page: Page) {
  await page.route(GITHUB_API, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
  );
}
