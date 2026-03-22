import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import type { UnsafeTypographyMeta } from '../../types/text';

/* ── Props ──────────────────────────────────────────────── */

type UNSAFE_TypographyProps = TypographyProps & {
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
 * <UNSAFE_Typography
 *   variant="overline"
 *   _unsafe={{
 *     reason: 'IDE chrome simulation requires custom letter-spacing',
 *     owner: 'src/components/ide',
 *     expiresBy: '2026-09-01',
 *   }}
 * >
 *   Terminal
 * </UNSAFE_Typography>
 * ```
 */
export const UNSAFE_Typography = ({ _unsafe, ...props }: UNSAFE_TypographyProps) => {
  if (process.env.NODE_ENV === 'development' && !_unsafe.reason) {
    console.warn('[UNSAFE_Typography] missing required "reason" in _unsafe metadata');
  }

  return <Typography {...props} />;
};
