import { test, expect } from '@playwright/test';

test.describe('Climbing page', () => {
  test('renders climbing route tables and inline route links', async ({ page }) => {
    await page.goto('/climbing');
    const main = page.locator('main');
    await expect(
      main.getByText("A collection of routes I've remembered to tick on Mountain Project.")
    ).toBeVisible();
    await expect(main.getByText('TODO Routes')).toBeVisible();
    await expect(main.getByRole('link', { name: 'Hyperspace' })).toHaveAttribute(
      'href',
      'https://www.mountainproject.com/route/106279399/hyperspace'
    );
    await expect(main.getByRole('link', { name: "1000' of Fun" })).toHaveAttribute(
      'href',
      'https://www.mountainproject.com/route/105718108/1000-of-fun'
    );

    const tickLink = main.getByRole('link', { name: 'Hyperspace' });

    await tickLink.hover();
    await expect(page.getByText('Open Hyperspace on Mountain Project.')).toBeVisible();
  });
});
