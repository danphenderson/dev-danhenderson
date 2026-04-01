import type { SxProps, Theme } from '@mui/material/styles';

/** Normalizes a caller-provided sx prop into an array for custom composition. */
export const normalizeSxProp = (sx: SxProps<Theme> | undefined) =>
  Array.isArray(sx) ? sx : sx ? [sx] : [];

/** Merges default sx layers with caller-provided sx while preserving precedence order. */
export const mergeSx = (
  defaults: SxProps<Theme> | SxProps<Theme>[],
  callerSx: SxProps<Theme> | undefined
): SxProps<Theme> => {
  const base = Array.isArray(defaults) ? defaults.flat() : [defaults];
  return [...base, ...normalizeSxProp(callerSx)] as SxProps<Theme>;
};
