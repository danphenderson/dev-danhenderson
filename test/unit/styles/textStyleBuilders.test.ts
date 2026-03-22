import { createTheme } from '@mui/material/styles';
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

  it('returns a fallback for unknown combinations', () => {
    const { resolveTypeset } = createTextStyleMap(lightTheme);
    // @ts-expect-error testing fallback behavior
    const ts = resolveTypeset('unknownRole');

    expect(ts.variant).toBe('body2');
    expect(ts.sx).toBeDefined();
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
});
