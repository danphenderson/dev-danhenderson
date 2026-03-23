import { alpha } from '@mui/material/styles';
import type { Variant } from '@mui/material/styles/createTypography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TextRole, TextTone, TextContext, TextUiRole, TextProseRole } from '../types/text';

/* ── Typeset entry ──────────────────────────────────────── */

/** A typeset fully describes the typographic treatment for one role. */
type TextVariant = Variant | 'inherit';

export type Typeset = {
  /** MUI variant used internally (not exposed to consumers). */
  variant: TextVariant;
  sx: SxProps<Theme>;
};

type BaseTypeset = {
  variant: TextVariant;
  sx: SxProps<Theme>;
};

/* ── Typeset key ────────────────────────────────────────── */

type TypesetKey = `${TextRole}:${TextTone}:${TextContext}`;

const key = (role: TextRole, tone: TextTone, ctx: TextContext): TypesetKey =>
  `${role}:${tone}:${ctx}`;

/* ── Builder ────────────────────────────────────────────── */

export const createTextStyleMap = (theme: Theme) => {
  const headingFontFamily = theme.typography.h1.fontFamily;
  const inheritTypographySx = {
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
  };

  const isObjectSx = (sx: SxProps<Theme>): sx is Record<string, unknown> =>
    typeof sx === 'object' && sx !== null && !Array.isArray(sx);

  /* ── Tone color helpers ─────────────────────────────── */

  const toneColor = (tone: TextTone): string => {
    switch (tone) {
      case 'default':
        return theme.palette.text.primary;
      case 'muted':
        return theme.palette.text.secondary;
      case 'accent':
        return theme.palette.primary.main;
      case 'support':
        return theme.palette.secondary.main;
      case 'inverse':
        return theme.palette.common.white;
    }
  };

  const toneSecondaryColor = (tone: TextTone): string => {
    switch (tone) {
      case 'default':
        return theme.palette.text.secondary;
      case 'muted':
        return theme.palette.text.secondary;
      case 'accent':
        return theme.palette.primary.main;
      case 'support':
        return theme.palette.secondary.main;
      case 'inverse':
        return alpha(theme.palette.common.white, 0.7);
    }
  };

  /* ── Base role definitions (UI context) ─────────────── */

  const uiRoles: Record<TextUiRole, BaseTypeset> = {
    pageTitle: {
      variant: 'h1',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: theme.typography.h1.lineHeight,
        fontSize: theme.typography.h1.fontSize,
      },
    },
    pageSubtitle: {
      variant: 'subtitle1',
      sx: {
        fontStyle: 'italic',
        lineHeight: 1.4,
      },
    },
    settingsSectionLabel: {
      variant: 'overline',
      sx: {
        fontFamily: headingFontFamily,
        fontSize: '0.625rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        lineHeight: 1,
        textTransform: 'uppercase' as const,
      },
    },
    sectionEyebrow: {
      variant: 'overline',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
      },
    },
    sectionTitle: {
      variant: 'h4',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.2,
      },
    },
    sectionSubtitle: {
      variant: 'subtitle1',
      sx: {
        lineHeight: 1.4,
      },
    },
    subsectionTitle: {
      variant: 'h6',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 600,
        lineHeight: 1.3,
        fontSize: '1.06rem',
      },
    },
    cardTitle: {
      variant: 'h6',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.3,
      },
    },
    cardSubtitle: {
      variant: 'subtitle1',
      sx: {
        fontStyle: 'italic',
        lineHeight: 1.4,
      },
    },
    body: {
      variant: 'body2',
      sx: {
        lineHeight: 1.58,
      },
    },
    bodyMuted: {
      variant: 'body2',
      sx: {
        lineHeight: 1.58,
      },
    },
    meta: {
      variant: 'body2',
      sx: {
        fontSize: '0.875rem',
        lineHeight: 1.4,
        fontWeight: 450,
      },
    },
    metaStrong: {
      variant: 'body2',
      sx: {
        fontSize: '0.875rem',
        lineHeight: 1.4,
        fontWeight: 700,
      },
    },
    caption: {
      variant: 'caption',
      sx: {
        lineHeight: 1.4,
      },
    },
    label: {
      variant: 'body2',
      sx: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.02em',
      },
    },
    inlineLabel: {
      variant: 'inherit',
      sx: inheritTypographySx,
    },
    metricValue: {
      variant: 'body2',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 1.2,
      },
    },
    metricLabel: {
      variant: 'caption',
      sx: {
        fontWeight: 500,
        lineHeight: 1.3,
        letterSpacing: '0.02em',
      },
    },
  };

  /* ── Prose role definitions ─────────────────────────── */

  const proseRoles: Record<TextProseRole, BaseTypeset> = {
    proseTitle: {
      variant: 'h2',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
      },
    },
    proseLead: {
      variant: 'h6',
      sx: {
        fontStyle: 'italic',
        fontWeight: 400,
        lineHeight: 1.4,
      },
    },
    proseHeading: {
      variant: 'h5',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.3,
      },
    },
    proseSubheading: {
      variant: 'h6',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.3,
      },
    },
    proseMinorHeading: {
      variant: 'subtitle1',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.35,
      },
    },
    proseParagraph: {
      variant: 'body1',
      sx: {
        lineHeight: 1.8,
        fontSize: '1.02rem',
      },
    },
    proseInlineCode: {
      variant: 'inherit',
      sx: {
        fontFamily: 'monospace',
        fontSize: '0.92em',
        fontWeight: 600,
        px: 0.45,
        py: 0.08,
        borderRadius: 0.75,
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.text.primary, 0.14)
            : alpha(theme.palette.text.primary, 0.06),
        border: '1px solid',
        borderColor:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.divider, 0.7)
            : alpha(theme.palette.divider, 0.9),
        boxDecorationBreak: 'clone',
      },
    },
    proseCaption: {
      variant: 'caption',
      sx: {
        fontStyle: 'italic',
        lineHeight: 1.4,
      },
    },
    proseQuote: {
      variant: 'body1',
      sx: {
        fontStyle: 'italic',
        lineHeight: 1.75,
        fontSize: '1.05rem',
      },
    },
    proseListItem: {
      variant: 'body1',
      sx: {
        lineHeight: 1.7,
        fontSize: '1.02rem',
      },
    },
  };

  /* ── Build the full typeset map ─────────────────────── */

  const map = new Map<TypesetKey, Typeset>();

  const allRoles = { ...uiRoles, ...proseRoles };
  const tones: TextTone[] = ['default', 'muted', 'accent', 'support', 'inverse'];
  const contexts: TextContext[] = ['ui', 'prose', 'overlay'];
  const secondaryDefaultRoles = new Set<TextRole>([
    'pageSubtitle',
    'settingsSectionLabel',
    'sectionSubtitle',
    'cardSubtitle',
    'bodyMuted',
    'meta',
    'metaStrong',
  ]);

  const resolveColor = (roleName: string, tone: TextTone): string => {
    const usesSecondary = tone === 'muted' || secondaryDefaultRoles.has(roleName as TextRole);
    if (!usesSecondary) return toneColor(tone);
    return toneSecondaryColor(tone === 'default' ? 'muted' : tone);
  };

  const getContextAdjustments = (roleName: string, ctx: TextContext): SxProps<Theme> => {
    if (ctx === 'overlay') {
      switch (roleName) {
        case 'cardTitle':
          return {
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          };
        case 'body':
        case 'bodyMuted':
          return {
            lineHeight: 1.48,
          };
        case 'caption':
          return {
            lineHeight: 1.25,
            letterSpacing: '0.01em',
          };
        default:
          return {};
      }
    }

    if (ctx === 'prose') {
      switch (roleName) {
        case 'body':
        case 'bodyMuted':
          return {
            lineHeight: 1.75,
            fontSize: '1.02rem',
          };
        case 'caption':
          return {
            lineHeight: 1.45,
            fontStyle: 'italic',
          };
        default:
          return {};
      }
    }

    return {};
  };

  for (const [roleName, base] of Object.entries(allRoles) as Array<[TextRole, BaseTypeset]>) {
    for (const tone of tones) {
      for (const ctx of contexts) {
        const color = resolveColor(roleName, tone);
        const baseSx = isObjectSx(base.sx) ? base.sx : {};
        const contextSx = getContextAdjustments(roleName, ctx);

        map.set(key(roleName, tone, ctx), {
          variant: base.variant,
          sx: {
            ...baseSx,
            ...(isObjectSx(contextSx) ? contextSx : {}),
            color,
          },
        });
      }
    }
  }

  /* ── Public API ─────────────────────────────────────── */

  const resolveTypeset = (
    role: TextRole,
    tone: TextTone = 'default',
    context: TextContext = 'ui'
  ): Typeset => {
    const typeset = map.get(key(role, tone, context));

    if (!typeset) {
      throw new Error(`Missing text typeset for ${key(role, tone, context)}`);
    }

    return typeset;
  };

  return { resolveTypeset } as const;
};
