import { expect, type Page } from '@playwright/test';
import { waitForAnimatedSectionReadiness } from './routeReadiness';

const climbingSummaryPattern =
  /A collection of ascents that were recorded on Mountain Project, including everything from the rare onsights to noteworthy top-ropes\./;

export const waitForClimbingIntro = async (page: Page) => {
  const main = page.locator('#main-content');
  const introLabel = main.getByText('Climbing', { exact: true }).first();

  await waitForAnimatedSectionReadiness({
    anchor: introLabel,
    readyLocators: [main.getByTestId('climbing-scroll-unlock-runway')],
  });

  return { main };
};

export const waitForClimbingContent = async (page: Page) => {
  const { main } = await waitForClimbingIntro(page);

  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
  });

  const runway = main.getByTestId('climbing-scroll-unlock-runway');
  const routesClimbed = main.getByText('Routes Climbed', { exact: true }).first();
  const firstRouteLink = main.locator('a[href*="mountainproject.com/route/"]').first();
  const routesToClimbIntro = main.getByText("A collection of routes I'd still like to climb.");

  await expect(runway).toHaveCount(0);

  await waitForAnimatedSectionReadiness({
    anchor: routesClimbed,
    readyLocators: [firstRouteLink, routesToClimbIntro],
  });

  return { main, firstRouteLink, routesToClimbIntro };
};
