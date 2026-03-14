/**
 * Spring-physics easing constants.
 *
 * These curves produce a slight overshoot-and-settle ("spring landing") feel
 * on entry animations.  The values are the classic ease-out-back curve and
 * are intentionally shared so every animated surface in the app uses the same
 * physical metaphor.
 *
 * CSS form  → `transition`, MUI `easing` props
 * Tuple form → Motion library `ease` option
 */

/** CSS `cubic-bezier()` string for use in `transition` shorthand and MUI easing props. */
export const SPRING_EASING_CSS = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';

/** Same curve as a `[number, number, number, number]` tuple for the Motion library. */
export const SPRING_EASING_MOTION: [number, number, number, number] = [0.175, 0.885, 0.32, 1.275];
