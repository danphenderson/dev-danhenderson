import { alpha } from '@mui/material/styles';
import { defaultAppAppearanceKey } from '../theme/appAppearance';
import { createAppTheme } from '../theme/createAppTheme';
import { createAppStyleMap } from './appStyleBuilders';

describe('createAppStyleMap', () => {
  it('uses the site default appearance shell treatment for non-CV routes', () => {
    const theme = createAppTheme('light', defaultAppAppearanceKey);
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<string, unknown>;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(theme.appearanceTreatment.key).toBe(defaultAppAppearanceKey);
    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.56));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.88),
      border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
    });
  });

  it('uses the strongest photo scrim and densest shell for evergreen', () => {
    const theme = createAppTheme('light', 'evergreen');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<string, unknown>;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.56));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.88),
      border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
    });
  });

  it('uses the medium atlas scrim and panel density', () => {
    const theme = createAppTheme('light', 'atlas');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<string, unknown>;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.46));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      border: `1px solid ${alpha(theme.palette.divider, 0.18)}`,
    });
  });

  it('uses the lightest expressive overlay and richer shell in ember dark mode', () => {
    const theme = createAppTheme('dark', 'ember');
    const styleMap = createAppStyleMap(theme);
    const backgroundImageSx = styleMap.getBackgroundImageSx('/assets/background.jpg') as Record<string, unknown>;
    const backgroundOverlaySx = backgroundImageSx['&::before'] as Record<string, unknown>;

    expect(backgroundOverlaySx.backgroundColor).toBe(alpha(theme.palette.common.black, 0.5));
    expect(styleMap.backgroundShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.background.paper, 0.6),
      border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
    });
  });

  it('gives the home hero shell a darker dedicated surface so the photo does not bleed through', () => {
    const theme = createAppTheme('light', defaultAppAppearanceKey);
    const styleMap = createAppStyleMap(theme);

    expect(styleMap.homeHeroShellSx).toMatchObject({
      backgroundColor: alpha(theme.palette.primary.contrastText, 0.76),
      backgroundImage: 'none',
      border: `1px solid ${alpha(theme.palette.common.white, 0.38)}`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    });
  });

  it('keeps header speed dials overflow-visible for header layouts', () => {
    const theme = createAppTheme('dark', 'ember');
    const styleMap = createAppStyleMap(theme);
    const headerAppearanceDialSx = styleMap.headerAppearanceDialSx as Record<string, unknown>;
    const headerPageDialSx = styleMap.headerPageDialSx as Record<string, unknown>;
    const headerPageDialActionsSx =
      headerPageDialSx['& .MuiSpeedDial-actions'] as Record<string, unknown>;

    expect(headerAppearanceDialSx.overflow).toBe('visible');
    expect(headerPageDialSx.overflow).toBe('visible');
    expect(headerPageDialActionsSx.position).toBe('absolute');
    expect(headerPageDialActionsSx.transform).toBe('translateY(-50%)');
  });
});
