import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TextRole, TextTone, TextContext } from '../types/text';

/* ── Typeset entry ──────────────────────────────────────── */

/** A typeset fully describes the typographic treatment for one role. */
export type Typeset = {
  /** MUI variant used internally (not exposed to consumers). */
  variant: string;
  sx: SxProps<Theme>;
};

/* ── Typeset key ────────────────────────────────────────── */

type TypesetKey = `${TextRole}:${TextTone}:${TextContext}`;

const key = (role: TextRole, tone: TextTone, ctx: TextContext): TypesetKey =>
  `${role}:${tone}:${ctx}`;

/* ── Builder ────────────────────────────────────────────── */

export const createTextStyleMap = (theme: Theme) => {
  const headingFontFamily = theme.typography.h1.fontFamily;

  /* ── Tone color helpers ─────────────────────────────── */

  const toneColor = (tone: TextTone): string => {
    switch (tone) {
      case 'default':
        return theme.palette.text.primary;
      case 'muted':
        return theme.palette.text.secondary;
      case 'accent':
        return theme.palette.primary.main;
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
      case 'inverse':
        return alpha(theme.palette.common.white, 0.7);
    }
  };

  /* ── Base role definitions (UI context) ─────────────── */

  const uiRoles: Record<string, { variant: string; sx: SxProps<Theme> }> = {
    pageTitle: {
      variant: 'h2',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        lineHeight: 1.15,
      },
    },
    pageSubtitle: {
      variant: 'subtitle1',
      sx: {
        fontStyle: 'italic',
        lineHeight: 1.4,
      },
    },
    sectionEyebrow: {
      variant: 'overline',
      sx: {
        fontFamily: headingFontFamily,
        fontWeight: 700,
        letterSpacing: '0.14em',
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

  const proseRoles: Record<string, { variant: string; sx: SxProps<Theme> }> = {
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
    proseParagraph: {
      variant: 'body1',
      sx: {
        lineHeight: 1.8,
        fontSize: '1.02rem',
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
  const tones: TextTone[] = ['default', 'muted', 'accent', 'inverse'];
  const contexts: TextContext[] = ['ui', 'prose', 'overlay'];

  const resolveColor = (roleName: string, tone: TextTone): string => {
    const usesSecondary = tone === 'muted' || roleName === 'bodyMuted';
    if (!usesSecondary) return toneColor(tone);
    return toneSecondaryColor(tone === 'default' ? 'muted' : tone);
  };

  for (const [roleName, base] of Object.entries(allRoles)) {
    for (const tone of tones) {
      for (const ctx of contexts) {
        const color = resolveColor(roleName, tone);

        map.set(key(roleName as TextRole, tone, ctx), {
          variant: base.variant,
          sx: {
            ...(typeof base.sx === 'object' && !Array.isArray(base.sx) ? base.sx : {}),
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
    return map.get(key(role, tone, context)) ?? { variant: 'body2', sx: {} };
  };

  return { resolveTypeset } as const;
};
