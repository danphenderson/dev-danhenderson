import { test, expect, type Page } from '@playwright/test';
import { dismissWelcomeSequence } from './helpers/header';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const FEATURED_POST_TITLE = 'Fixing and Enforcing None-Type Drift with a Codemod';
const FEATURED_POST_SLUG = 'fixing-and-enforcing-none-type-drift-with-a-codemod';
const BLOG_NOT_FOUND_COPY =
  /This article does not exist or has been moved\. Use the command palette or recovery links below to navigate to another page\./;
const INVALID_BLOG_SLUG_QUERY = 'nonexistent post';

const waitForBlogIndex = async (page: Page) => {
  const main = page.locator('main');

  await waitForAnimatedSectionReadiness({
    anchor: main.getByText(/\d+ articles?/),
    readyLocators: [
      main.getByText(/^Blog$/).first(),
      main.getByRole('button', { name: 'All' }),
      main.getByText('Featured Article'),
      main.getByRole('link', { name: new RegExp(FEATURED_POST_TITLE) }).first(),
    ],
  });
};

const waitForBlogFallback = async (page: Page) => {
  const main = page.locator('main');

  await waitForAnimatedSectionReadiness({
    anchor: main.getByRole('heading', { name: 'Post not found' }),
    readyLocators: [
      main.getByRole('link', { name: 'Back to blog' }),
      main.getByText(/^Blog$/).first(),
      main.getByText(BLOG_NOT_FOUND_COPY),
      main.getByRole('heading', { name: 'Suggested destinations' }),
      main.getByRole('heading', { name: 'Shared recovery routes' }),
      main.getByRole('link', { name: /^Open Blog:/ }).first(),
    ],
  });
};

test.describe('Blog index page', () => {
  test('renders the blog index with featured article and post list', async ({ page }) => {
    await page.goto('/blog');
    await waitForBlogIndex(page);

    const main = page.locator('main');

    // Header content
    await expect(main.getByText('Blog').first()).toBeVisible();
    await expect(main.getByText('1 article')).toBeVisible();

    // Featured article
    await expect(main.getByText(FEATURED_POST_TITLE).first()).toBeVisible();

    // Tag filter
    await expect(main.getByRole('button', { name: 'All' })).toBeVisible();

    // No non-featured posts — Recent Articles section should not render
    await expect(main.getByText('Recent Articles')).toHaveCount(0);
  });

  test('filters posts by tag when a tag chip is clicked', async ({ page }) => {
    await page.goto('/blog');
    await waitForBlogIndex(page);

    const main = page.locator('main');

    // Tag chips for the featured post's tags should be present
    await expect(main.getByRole('button', { name: 'python (1)' })).toBeVisible();

    // Clicking a tag that matches the featured post keeps it visible
    await main.getByRole('button', { name: 'python (1)' }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(main.getByText(FEATURED_POST_TITLE).first()).toBeVisible();

    // Click "All" to reset the filter
    await main.getByRole('button', { name: 'All' }).click();
    await expect(main.getByText(FEATURED_POST_TITLE).first()).toBeVisible();
  });

  test('navigates from the featured article to the post detail', async ({ page }) => {
    await page.goto('/blog');
    await waitForBlogIndex(page);

    await page
      .getByRole('link', { name: new RegExp(FEATURED_POST_TITLE) })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/blog/${FEATURED_POST_SLUG}$`));
    await expect(page.getByRole('heading', { name: FEATURED_POST_TITLE, level: 1 })).toBeVisible();
  });
});

test.describe('Blog post detail page', () => {
  test('renders the article with header, body, and navigation', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    const main = page.locator('main');

    // Back button
    await expect(main.getByRole('link', { name: 'Back to blog' })).toBeVisible();

    // Article title
    await expect(page.getByRole('heading', { name: FEATURED_POST_TITLE, level: 1 })).toBeVisible();

    // Article body renders content — scroll down to trigger scroll-animated sections
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'auto' }));
    await expect(
      main.getByRole('heading', { name: 'The problem with None annotations in Python' })
    ).toBeVisible({ timeout: 15000 });

    // With only one post, article navigation and related articles must not render
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' })
    );
    await expect(main.getByText('Next')).toHaveCount(0);
    await expect(main.getByText('Previous')).toHaveCount(0);
    await expect(main.getByText('Related articles')).toHaveCount(0);
  });

  test('article navigation is absent when the blog contains a single post', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    const main = page.locator('main');

    // Scroll to ensure any lazy-rendered navigation would have mounted
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' })
    );

    // BlogArticleNav returns null when there is no prev/next post
    await expect(main.getByText('Previous')).toHaveCount(0);
    await expect(main.getByText('Next')).toHaveCount(0);
  });

  test('back to blog button returns to the blog index', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    await page.getByRole('link', { name: 'Back to blog' }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await waitForBlogIndex(page);
  });

  test('renders a syntax-highlighted code block from the featured article', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    const highlightedKeyword = page.locator('main [data-token-kind="keyword"]').filter({
      hasText: 'def',
    });
    await expect(highlightedKeyword.first()).toBeVisible();

    const highlightedType = page.locator('main [data-token-kind="type"]').filter({
      hasText: 'Optional',
    });
    await expect(highlightedType.first()).toBeVisible();
  });

  test('renders inline code spans inside prose paragraphs', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    const unionCode = page.locator('main p code').filter({ hasText: 'Union[..., None]' }).first();
    await unionCode.scrollIntoViewIfNeeded();
    await expect(unionCode).toBeVisible();
    await expect(
      page.locator('main p code [data-token-kind="type"]').filter({ hasText: 'Union' }).first()
    ).toBeVisible();
    await expect(
      page.locator('main p code [data-token-kind="constant"]').filter({ hasText: 'None' }).first()
    ).toBeVisible();

    const pep604Code = page.locator('main p code').filter({ hasText: 'T | None' }).first();
    await pep604Code.scrollIntoViewIfNeeded();
    await expect(pep604Code).toBeVisible();
    await expect(
      pep604Code.locator('[data-token-kind="constant"]').filter({ hasText: 'None' })
    ).toHaveCount(1);
  });

  test('shows recovery panel for an invalid blog slug', async ({ page }) => {
    await page.goto('/blog/nonexistent-post');

    const main = page.locator('main');
    await waitForBlogFallback(page);

    await main.getByRole('button', { name: 'Open command palette' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(1);
    const dialog = page.getByRole('dialog', { name: 'Command palette' });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: 'Search routes, albums, and CV sections' })
    ).toHaveValue(INVALID_BLOG_SLUG_QUERY);
  });
});

test.describe('Blog cross-route navigation', () => {
  test('header navigation includes a Blog link that reaches the blog index', async ({ page }) => {
    await page.goto('/');

    await dismissWelcomeSequence(page);

    // The header should contain a Blog link
    const blogLink = page.getByRole('link', { name: 'Blog' });
    await expect(blogLink).toBeVisible();
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog$/);
    await waitForBlogIndex(page);
  });
});
