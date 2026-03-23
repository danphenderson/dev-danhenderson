import { createTextStyleMap } from '../../../src/styles/textStyleBuilders';
import { createAppTheme } from '../../../src/theme/createAppTheme';

const lightTheme = createAppTheme('light', 'atlas');
const darkTheme = createAppTheme('dark', 'atlas');

describe('createTextStyleMap', () => {
  it('returns a resolveTypeset function', () => {
    const map = createTextStyleMap(lightTheme);

    expect(typeof map.resolveTypeset).toBe('function');
  });

  it('resolves a known UI role', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('sectionTitle');

    expect(ts.variant).toBe('h4');
    expect(ts.sx).toBeDefined();
  });

  it('resolves a known prose role', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('proseParagraph');

    expect(ts.variant).toBe('body1');
  });

  it('resolves proseMinorHeading with a distinct variant', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('proseMinorHeading');

    expect(ts.variant).toBe('subtitle1');
  });

  it('resolves proseInlineCode with inherited typography and monospace styling', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('proseInlineCode');
    const sx = ts.sx as Record<string, unknown>;

    expect(ts.variant).toBe('inherit');
    expect(sx.fontFamily).toBe('monospace');
  });

  it('throws for unknown roles instead of silently falling back', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    expect(() => {
      // @ts-expect-error testing invalid runtime input
      resolveTypeset('unknownRole');
    }).toThrow('Missing text typeset');
  });

  it('applies muted tone as secondary color', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('body', 'muted');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(lightTheme.palette.text.secondary);
  });

  it('applies inverse tone as white', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('cardTitle', 'inverse');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(lightTheme.palette.common.white);
  });

  it('applies accent tone as primary.main', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('sectionEyebrow', 'accent');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(lightTheme.palette.primary.main);
  });

  it('applies support tone as secondary.main', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('sectionEyebrow', 'support');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(lightTheme.palette.secondary.main);
  });

  it('resolves the same role in dark mode', () => {
    const { resolveTypeset } = createTextStyleMap(darkTheme);
    const ts = resolveTypeset('sectionTitle');

    expect(ts.variant).toBe('h4');
  });

  it('meta role has lighter weight than metaStrong', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const meta = resolveTypeset('meta');
    const metaStrong = resolveTypeset('metaStrong');
    const metaSx = meta.sx as Record<string, unknown>;
    const metaStrongSx = metaStrong.sx as Record<string, unknown>;

    expect(metaSx.fontWeight).toBeLessThan(metaStrongSx.fontWeight as number);
  });

  it('proseTitle has heavier weight than sectionTitle', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const prose = resolveTypeset('proseTitle');
    const section = resolveTypeset('sectionTitle');
    const proseSx = prose.sx as Record<string, unknown>;
    const sectionSx = section.sx as Record<string, unknown>;

    expect(proseSx.fontWeight).toBeGreaterThanOrEqual(sectionSx.fontWeight as number);
  });

  it('bodyMuted resolves with secondary color by default', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('bodyMuted');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(lightTheme.palette.text.secondary);
  });

  it('meta roles resolve with secondary color by default', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const meta = resolveTypeset('meta');
    const metaStrong = resolveTypeset('metaStrong');
    const metaSx = meta.sx as Record<string, unknown>;
    const metaStrongSx = metaStrong.sx as Record<string, unknown>;

    expect(metaSx.color).toBe(lightTheme.palette.text.secondary);
    expect(metaStrongSx.color).toBe(lightTheme.palette.text.secondary);
  });

  it('uses h1 for pageTitle and inherit for inlineLabel', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);

    expect(resolveTypeset('pageTitle').variant).toBe('h1');
    expect(resolveTypeset('inlineLabel').variant).toBe('inherit');
  });

  it('resolves settingsSectionLabel as overline', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);

    expect(resolveTypeset('settingsSectionLabel').variant).toBe('overline');
  });

  it('prose context changes shared body typesets', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const uiBody = resolveTypeset('body');
    const proseBody = resolveTypeset('body', 'default', 'prose');
    const uiSx = uiBody.sx as Record<string, unknown>;
    const proseSx = proseBody.sx as Record<string, unknown>;

    expect(proseSx.lineHeight).not.toBe(uiSx.lineHeight);
    expect(proseSx.fontSize).toBe('1.02rem');
  });

  it('overlay context changes cardTitle typesets', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const uiCardTitle = resolveTypeset('cardTitle');
    const overlayCardTitle = resolveTypeset('cardTitle', 'inverse', 'overlay');
    const uiSx = uiCardTitle.sx as Record<string, unknown>;
    const overlaySx = overlayCardTitle.sx as Record<string, unknown>;

    expect(overlaySx.lineHeight).not.toBe(uiSx.lineHeight);
    expect(overlaySx.letterSpacing).toBe('-0.01em');
  });

  it('sectionEyebrow includes letterSpacing', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('sectionEyebrow');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.letterSpacing).toBeDefined();
  });

  it('metricValue uses a heading font family', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    const ts = resolveTypeset('metricValue');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.fontFamily).toBe(lightTheme.typography.h1.fontFamily);
  });

  /* ── Cross-preset coverage ──────────────────────────── */

  const presets = ['atlas', 'evergreen', 'ember', 'solstice', 'drift', 'graphite'] as const;

  it.each(presets)('resolves sectionTitle for %s preset in light mode', (preset) => {
    const theme = createAppTheme('light', preset);
    const { resolveTypeset } = createTextStyleMap(theme);
    const ts = resolveTypeset('sectionTitle');

    expect(ts.variant).toBe('h4');
    expect(ts.sx).toBeDefined();
  });

  it.each(presets)('resolves inverse tone for %s preset', (preset) => {
    const theme = createAppTheme('dark', preset);
    const { resolveTypeset } = createTextStyleMap(theme);
    const ts = resolveTypeset('cardTitle', 'inverse');
    const sx = ts.sx as Record<string, unknown>;

    expect(sx.color).toBe(theme.palette.common.white);
  });
});
