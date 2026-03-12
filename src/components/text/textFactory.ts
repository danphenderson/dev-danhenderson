import type { SxProps, Theme } from '@mui/material/styles';
import { normalizeSxProp } from '../../utils/sx';

/**
 * Merges a set of default `sx` values with caller-provided `sx`, producing a
 * flat array suitable for MUI's array-form `sx` prop.
 */
export const mergeSx = (
  defaults: SxProps<Theme> | SxProps<Theme>[],
  callerSx: SxProps<Theme> | undefined
): SxProps<Theme> => {
  const base = Array.isArray(defaults) ? defaults.flat() : [defaults];
  return [...base, ...normalizeSxProp(callerSx)] as SxProps<Theme>;
};
