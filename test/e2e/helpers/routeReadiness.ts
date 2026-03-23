import { expect, type Locator } from '@playwright/test';

type AnimatedSectionReadinessOptions = {
  anchor: Locator;
  readyLocators?: Locator[];
  hiddenLocators?: Locator[];
};

const isAnchorAnimationReady = async (anchor: Locator) =>
  anchor.evaluate(async (node) => {
    const element = node as HTMLElement;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        opacity: Number.parseFloat(style.opacity || '1'),
        display: style.display,
        visibility: style.visibility,
      };
    };

    const first = measure();

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });

    const second = measure();
    const motionDelta =
      Math.abs(first.x - second.x) +
      Math.abs(first.y - second.y) +
      Math.abs(first.width - second.width) +
      Math.abs(first.height - second.height);

    return (
      second.display !== 'none' &&
      second.visibility !== 'hidden' &&
      second.opacity >= 0.99 &&
      second.width > 0 &&
      second.height > 0 &&
      motionDelta < 0.5
    );
  });

export async function waitForAnimatedSectionReadiness({
  anchor,
  readyLocators = [],
  hiddenLocators = [],
}: AnimatedSectionReadinessOptions) {
  await anchor.evaluate((node) => {
    node.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
  });
  await expect(anchor).toBeVisible();
  await expect
    .poll(() => isAnchorAnimationReady(anchor), {
      message: 'Timed out waiting for animated section content to finish revealing.',
    })
    .toBe(true);

  for (const locator of readyLocators) {
    await expect(locator).toBeVisible();
  }

  for (const locator of hiddenLocators) {
    await expect(locator).toHaveCount(0);
  }
}
