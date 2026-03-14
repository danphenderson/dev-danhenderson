/** Return the maximum horizontal scroll distance for a scrollable element. */
export const getMaxScrollLeft = (node: HTMLElement): number =>
  Math.max(node.scrollWidth - node.clientWidth, 0);

/** Check whether an element is at least partially visible in the viewport. */
export const isElementInViewport = (node: HTMLElement): boolean => {
  const rect = node.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};
