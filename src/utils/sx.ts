import type { SxProps, Theme } from '@mui/material/styles';

export const normalizeSxProp = (sx: SxProps<Theme> | undefined) =>
  Array.isArray(sx) ? sx : sx ? [sx] : [];
