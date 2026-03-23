import { getMaxScrollLeft, isElementInViewport } from '../../../src/utils/dom';

/* ── getMaxScrollLeft ── */

describe('getMaxScrollLeft', () => {
  const makeNode = (scrollWidth: number, clientWidth: number) =>
    ({ scrollWidth, clientWidth }) as HTMLElement;

  it('returns the difference when scrollWidth exceeds clientWidth', () => {
    expect(getMaxScrollLeft(makeNode(1000, 400))).toBe(600);
  });

  it('returns 0 when content fits within the client area', () => {
    expect(getMaxScrollLeft(makeNode(400, 400))).toBe(0);
  });

  it('returns 0 when clientWidth exceeds scrollWidth', () => {
    expect(getMaxScrollLeft(makeNode(200, 400))).toBe(0);
  });

  it('returns 0 for zero-width elements', () => {
    expect(getMaxScrollLeft(makeNode(0, 0))).toBe(0);
  });
});

/* ── isElementInViewport ── */

describe('isElementInViewport', () => {
  const makeNode = (rect: Partial<DOMRect>) => {
    const fullRect = {
      width: 100,
      height: 100,
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    };
    return {
      getBoundingClientRect: () => ({ ...fullRect, ...rect }),
    } as HTMLElement;
  };

  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  it('returns true for an element fully within the viewport', () => {
    expect(isElementInViewport(makeNode({ top: 100, bottom: 200, width: 100, height: 100 }))).toBe(
      true
    );
  });

  it('returns true for an element partially above the viewport (bottom > 0)', () => {
    expect(isElementInViewport(makeNode({ top: -50, bottom: 50, width: 100, height: 100 }))).toBe(
      true
    );
  });

  it('returns true for an element partially below the viewport (top < innerHeight)', () => {
    expect(isElementInViewport(makeNode({ top: 750, bottom: 850, width: 100, height: 100 }))).toBe(
      true
    );
  });

  it('returns false for an element entirely above the viewport', () => {
    expect(
      isElementInViewport(makeNode({ top: -200, bottom: -100, width: 100, height: 100 }))
    ).toBe(false);
  });

  it('returns false for an element entirely below the viewport', () => {
    expect(isElementInViewport(makeNode({ top: 900, bottom: 1000, width: 100, height: 100 }))).toBe(
      false
    );
  });

  it('returns false for a zero-width element', () => {
    expect(isElementInViewport(makeNode({ width: 0, height: 100, top: 100, bottom: 200 }))).toBe(
      false
    );
  });

  it('returns false for a zero-height element', () => {
    expect(isElementInViewport(makeNode({ width: 100, height: 0, top: 100, bottom: 100 }))).toBe(
      false
    );
  });

  it('returns false when bottom is exactly 0 (element ends at viewport top edge)', () => {
    expect(isElementInViewport(makeNode({ top: -100, bottom: 0, width: 100, height: 100 }))).toBe(
      false
    );
  });

  it('returns false when top equals innerHeight (element starts at viewport bottom edge)', () => {
    expect(isElementInViewport(makeNode({ top: 800, bottom: 900, width: 100, height: 100 }))).toBe(
      false
    );
  });
});
