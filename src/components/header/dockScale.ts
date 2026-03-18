/**
 * Proximity-based dock magnification scale for speed-dial actions.
 *
 * Shared between HeaderAppearanceDial and HeaderMotionDial so both
 * dials render the same macOS-dock-like interactive sizing effect.
 */

export const PROXIMITY_SCALES = [1.38, 1.2, 1.08] as const;

export const getProximityScale = (
  actionId: string,
  hoveredId: string | null,
  orderedIds: string[]
): number => {
  if (!hoveredId) return 1;
  const hoveredIdx = orderedIds.indexOf(hoveredId);
  const targetIdx = orderedIds.indexOf(actionId);
  if (hoveredIdx === -1 || targetIdx === -1) return 1;
  const distance = Math.abs(targetIdx - hoveredIdx);
  return distance < PROXIMITY_SCALES.length ? PROXIMITY_SCALES[distance] : 1;
};
