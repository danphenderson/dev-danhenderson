import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import type { UnsafeTypographyMeta } from '../../types/text';
import { readNodeEnvironment } from '../../utils/appEnvironment';

/* ── Props ──────────────────────────────────────────────── */

type UnsafeTypographyProps = TypographyProps & {
  /** Required metadata explaining why the escape hatch is used. */
  _unsafe: UnsafeTypographyMeta;
};

/* ── Component ──────────────────────────────────────────── */

/**
 * Explicit escape hatch for raw MUI Typography.
 *
 * Use this **only** in explicitly sanctioned exception modules (e.g. the
 * IDE-chrome hero) where the shared `Text` primitive cannot express the
 * required visual treatment.
 *
 * The `_unsafe` prop is required and documents the exception for auditing.
 * These usages should be rare and have an expiration date.
 *
 * @example
 * ```tsx
 * <UnsafeTypography
 *   variant="overline"
 *   _unsafe={{
 *     reason: 'IDE chrome simulation requires custom letter-spacing',
 *     owner: 'src/components/ide',
 *     expiresBy: '2026-09-01',
 *   }}
 * >
 *   Terminal
 * </UnsafeTypography>
 * ```
 */
export const UnsafeTypography = ({ _unsafe, ...props }: UnsafeTypographyProps) => {
  if (readNodeEnvironment() === 'development') {
    if (!_unsafe.reason) {
      console.warn('[UnsafeTypography] missing required "reason" in _unsafe metadata');
    }
    if (!_unsafe.owner) {
      console.warn('[UnsafeTypography] missing required "owner" in _unsafe metadata');
    }
    if (!_unsafe.expiresBy) {
      console.warn('[UnsafeTypography] missing required "expiresBy" in _unsafe metadata');
    }
  }

  return <Typography {...props} />;
};
