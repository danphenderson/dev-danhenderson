import { alpha } from '@mui/material/styles';
import { defaultAppAppearanceKey } from '../../../src/theme/appAppearance';
import { createAppTheme } from '../../../src/theme/createAppTheme';
import { createAppStyleMap } from '../../../src/styles/appStyleBuilders';

describe('createAppStyleMap', () => {
  it('uses the site default appearance shell treatment for non-CV routes', () => {
    const theme = createAppTheme('light', defaultAppAppearanceKey);
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<
      string,
      unknown
    >;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(theme.appearanceTreatment.key).toBe(defaultAppAppearanceKey);
    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.62));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.88),
      border: `1px solid ${alpha(
        theme.palette.divider,
        theme.appearanceTreatment.surface.panelBorderAlpha * 0.5
      )}`,
    });
  });

  it('uses the strongest photo scrim and densest shell for evergreen', () => {
    const theme = createAppTheme('light', 'evergreen');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<
      string,
      unknown
    >;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.62));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.88),
      border: `1px solid ${alpha(
        theme.palette.divider,
        theme.appearanceTreatment.surface.panelBorderAlpha * 0.5
      )}`,
    });
  });

  it('uses the medium atlas scrim and panel density', () => {
    const theme = createAppTheme('light', 'atlas');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<
      string,
      unknown
    >;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.52));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      border: `1px solid ${alpha(
        theme.palette.divider,
        theme.appearanceTreatment.surface.panelBorderAlpha * 0.5
      )}`,
    });
  });

  it('uses the lightest expressive overlay and richer shell in ember dark mode', () => {
    const theme = createAppTheme('dark', 'ember');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<
      string,
      unknown
    >;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.56));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      border: `1px solid ${alpha(
        theme.palette.divider,
        theme.appearanceTreatment.surface.panelBorderAlpha * 0.5
      )}`,
    });
  });

  it('keeps the home hero shell transparent so the embedded VS Code window owns the chrome', () => {
    const theme = createAppTheme('light', defaultAppAppearanceKey);
    const styleMap = createAppStyleMap(theme);

    expect(styleMap.homeHeroShellSx).toMatchObject({
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      border: 'none',
      boxShadow: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderRadius: 1,
    });
  });

  it('keeps header speed dials overflow-visible for header layouts', () => {
    const theme = createAppTheme('dark', 'ember');
    const styleMap = createAppStyleMap(theme);
    const headerAppearanceDialSx = styleMap.headerAppearanceDialSx as Record<string, unknown>;

    expect(headerAppearanceDialSx.overflow).toBe('visible');
  });
});
