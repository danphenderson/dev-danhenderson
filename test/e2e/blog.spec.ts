import { test, expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './helpers/routeReadiness';

const FEATURED_POST_TITLE = 'Building a Design System That Scales';
const FEATURED_POST_SLUG = 'building-a-design-system-that-scales';
const SECOND_POST_TITLE = 'React Performance Patterns Beyond React.memo';
const SECOND_POST_SLUG = 'react-performance-patterns-beyond-memo';
const THIRD_POST_TITLE = 'TypeScript Discriminated Unions for UI State Machines';
const BLOG_NOT_FOUND_COPY =
  /This article does not exist or has been moved\. Use the command palette or recovery links below to navigate to another page\./;
const INVALID_BLOG_SLUG_QUERY = 'nonexistent post';

const waitForBlogIndex = async (page: Page) => {
  const main = page.locator('main');
  await waitForAnimatedSectionReadiness({
    anchor: main.getByText(
      'Technical writing on frontend architecture, React patterns, and software engineering.'
    ),
    readyLocators: [main.getByText(/\d+ articles?/)],
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
    await expect(main.getByText('3 articles')).toBeVisible();

    // Featured article
    await expect(main.getByText(FEATURED_POST_TITLE).first()).toBeVisible();

    // Tag filter
    await expect(main.getByRole('button', { name: 'All' })).toBeVisible();

    // Recent articles heading
    await expect(main.getByText('Recent Articles')).toBeVisible();

    // Non-featured posts should be listed
    await expect(main.getByText(SECOND_POST_TITLE)).toBeVisible();
    await expect(main.getByText(THIRD_POST_TITLE)).toBeVisible();
  });

  test('filters posts by tag when a tag chip is clicked', async ({ page }) => {
    await page.goto('/blog');
    await waitForBlogIndex(page);

    const main = page.locator('main');

    // Both non-featured posts visible initially
    await expect(main.getByText(SECOND_POST_TITLE)).toBeVisible();
    await expect(main.getByText(THIRD_POST_TITLE)).toBeVisible();

    // Click the "performance" tag — only the React Performance post includes it
    await main.getByRole('button', { name: 'performance (1)' }).click();
    await expect(main.getByText(SECOND_POST_TITLE)).toBeVisible();
    await expect(main.getByText(THIRD_POST_TITLE)).toHaveCount(0);

    // Click "All" to reset the filter
    await main.getByRole('button', { name: 'All' }).click();
    await expect(main.getByText(SECOND_POST_TITLE)).toBeVisible();
    await expect(main.getByText(THIRD_POST_TITLE)).toBeVisible();
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
      main.getByRole('heading', { name: 'Start with tokens, not components' })
    ).toBeVisible({ timeout: 15000 });

    // Article navigation — scroll to the bottom to reach nav and related sections
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' })
    );
    await expect(main.getByText('Next')).toBeVisible({ timeout: 15000 });
    await expect(main.getByRole('link', { name: /^Next/ })).toBeVisible();

    // Related articles section
    await expect(main.getByText('Related articles')).toBeVisible();
  });

  test('navigates between adjacent posts via article navigation', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    const main = page.locator('main');

    // Navigate to next post
    await main
      .getByRole('link', { name: new RegExp(SECOND_POST_TITLE) })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`/blog/${SECOND_POST_SLUG}$`));
    await expect(page.getByRole('heading', { name: SECOND_POST_TITLE, level: 1 })).toBeVisible();

    // The second post should have both Previous and Next links
    await expect(main.getByText('Previous')).toBeVisible();
    await expect(main.getByText('Next')).toBeVisible();
  });

  test('back to blog button returns to the blog index', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    await page.getByRole('link', { name: 'Back to blog' }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByText('3 articles')).toBeVisible();
  });

  test('renders a callout block with the note role', async ({ page }) => {
    await page.goto(`/blog/${FEATURED_POST_SLUG}`);

    // The featured post has a tip callout — scroll to it since it's below the fold
    const callout = page.locator('[role="note"]').first();
    await callout.scrollIntoViewIfNeeded();
    await expect(callout).toBeVisible();
    await expect(callout).toContainText('Design for the caller');
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
      dialog.getByRole('textbox', { name: 'Search routes, albums, and CV sections' })
    ).toHaveValue(INVALID_BLOG_SLUG_QUERY);
  });
});

test.describe('Blog cross-route navigation', () => {
  test('header navigation includes a Blog link that reaches the blog index', async ({ page }) => {
    await page.goto('/');

    // Dismiss the welcome prompt to reach the main UI
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'No thanks' }).click();
    await expect(dialog).toBeHidden();

    // Dismiss the dark mode hint
    const darkModeHint = page.getByText(/Try an alternative theme/i);
    await expect(darkModeHint).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(darkModeHint).toBeHidden();

    // The header should contain a Blog link
    const blogLink = page.getByRole('link', { name: 'Blog' });
    await expect(blogLink).toBeVisible();
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByText('3 articles')).toBeVisible();
  });
});
