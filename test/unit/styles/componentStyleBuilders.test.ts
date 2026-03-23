import { alpha } from '@mui/material/styles';
import { defaultAppAppearanceKey } from '../../../src/theme/appAppearance';
import { createAppTheme } from '../../../src/theme/createAppTheme';
import { createComponentStyleMap } from '../../../src/styles/componentStyleBuilders';

describe('createComponentStyleMap', () => {
  it('uses the secondary accent for CV support roles while applying ember-consistent evergreen motion', () => {
    const theme = createAppTheme('light', 'evergreen');
    const styleMap = createComponentStyleMap(theme);
    const surface = theme.appearanceTreatment.surface;
    const tabSx = styleMap.getTabSx(false) as Record<string, unknown>;
    const gitHubChipSx = styleMap.getGitHubChipSx('stack') as Record<string, unknown>;
    const contentCardSx = styleMap.contentCardSx as Record<string, unknown>;
    const sectionCardSx = styleMap.cvSectionCardSx as Record<string, unknown>;
    const sectionPanelSx = styleMap.sectionPanelSx as Record<string, unknown>;
    const sectionGlowSx = sectionCardSx['&::before'] as Record<string, unknown>;

    expect((styleMap.statusBreatheSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((styleMap.supportAccentInteractiveSurfaceSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((gitHubChipSx['& .MuiChip-icon'] as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((styleMap.cvEntryChipSx as Record<string, unknown>).borderColor).toBe(
      theme.palette.secondary.main
    );
    expect((styleMap.contributionInlineMetaSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((styleMap.contributionCardMetaSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((styleMap.sectionHeadingOverlineTextSx as Record<string, unknown>).animationDelay).toBe(
      '0ms'
    );
    expect((styleMap.sectionHeadingTitleTextSx as Record<string, unknown>).animationDelay).toBe(
      '120ms'
    );
    expect(contentCardSx.background).toEqual(
      expect.stringContaining(
        alpha(theme.palette.secondary.main, Math.min(surface.secondaryTintAlpha + 0.02, 0.22))
      )
    );
    expect(sectionPanelSx.background).toEqual(
      expect.stringContaining(
        alpha(theme.palette.secondary.main, Math.min(surface.secondaryTintAlpha, 0.16))
      )
    );
    expect(sectionCardSx.background).toEqual(
      expect.stringContaining(
        alpha(theme.palette.secondary.main, Math.min(surface.secondaryTintAlpha + 0.02, 0.18))
      )
    );
    expect(tabSx.color).toBe(theme.palette.primary.main);
    expect((tabSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect((tabSx['&:hover::after'] as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('500ms linear')
    );
    expect((gitHubChipSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect((gitHubChipSx['&:hover::after'] as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('500ms linear')
    );
    expect((styleMap.chipWaveSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('8600ms linear infinite')
    );
    expect((styleMap.getChipWaveDelaySx(2) as Record<string, unknown>).animationDelay).toBe('1.5s');
    expect((styleMap.statusBreatheSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('3600ms ease-in-out infinite')
    );
    expect((styleMap.sectionHeadingTitleTextSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('3800ms ease-in-out infinite')
    );
    expect(contentCardSx.backdropFilter).toBe('blur(6px)');
    expect((contentCardSx['&::after'] as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('8200ms ease-in-out infinite')
    );
    expect(sectionGlowSx.opacity).toBe(0.16);
    expect(sectionGlowSx.animation).toEqual(expect.stringContaining('5600ms ease-in-out infinite'));
    expect(sectionCardSx['&::after']).toBeUndefined();
  });

  it('keeps atlas surface treatment while applying ember-consistent ambient motion', () => {
    const theme = createAppTheme('light', 'atlas');
    const styleMap = createComponentStyleMap(theme);
    const tabSx = styleMap.getTabSx(false) as Record<string, unknown>;
    const tabHoverAfterSx = tabSx['&:hover::after'] as Record<string, unknown>;
    const gitHubChipSx = styleMap.getGitHubChipSx('stack') as Record<string, unknown>;
    const gitHubChipHoverAfterSx = gitHubChipSx['&:hover::after'] as Record<string, unknown>;
    const contentCardSx = styleMap.contentCardSx as Record<string, unknown>;
    const contentCardGlowSx = contentCardSx['&::after'] as Record<string, unknown>;
    const sectionCardSx = styleMap.cvSectionCardSx as Record<string, unknown>;
    const sectionGlowSx = sectionCardSx['&::before'] as Record<string, unknown>;
    const sectionSweepSx = sectionCardSx['&::after'] as Record<string, unknown>;

    expect((tabSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect(tabHoverAfterSx.animation).toEqual(expect.stringContaining('500ms linear'));
    expect((gitHubChipSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect(gitHubChipHoverAfterSx.animation).toEqual(expect.stringContaining('500ms linear'));
    expect((styleMap.supportAccentInteractiveSurfaceSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect(tabSx.color).toBe(theme.palette.primary.main);
    expect((styleMap.chipWaveSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('8600ms linear infinite')
    );
    expect((styleMap.getChipWaveDelaySx(2) as Record<string, unknown>).animationDelay).toBe('1.5s');
    expect((styleMap.statusBreatheSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('3600ms ease-in-out infinite')
    );
    expect((styleMap.sectionHeadingTitleTextSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('3800ms ease-in-out infinite')
    );
    expect(contentCardSx.backdropFilter).toBe('blur(8px)');
    expect(contentCardGlowSx.animation).toEqual(
      expect.stringContaining('8200ms ease-in-out infinite')
    );
    expect(sectionGlowSx.opacity).toBe(0.3);
    expect(sectionGlowSx.animation).toEqual(expect.stringContaining('5600ms ease-in-out infinite'));
    expect(sectionSweepSx.opacity).toBe(0.46);
    expect(sectionSweepSx.animation).toEqual(expect.stringContaining('6800ms linear infinite'));
  });

  it('keeps ember as the most expressive preset across chips, headings, and cards', () => {
    const theme = createAppTheme('dark', 'ember');
    const styleMap = createComponentStyleMap(theme);
    const tabSx = styleMap.getTabSx(false) as Record<string, unknown>;
    const tabHoverAfterSx = tabSx['&:hover::after'] as Record<string, unknown>;
    const gitHubChipSx = styleMap.getGitHubChipSx('wrap') as Record<string, unknown>;
    const gitHubChipHoverAfterSx = gitHubChipSx['&:hover::after'] as Record<string, unknown>;
    const chipWaveSx = styleMap.chipWaveSx as Record<string, unknown>;
    const contentCardSx = styleMap.contentCardSx as Record<string, unknown>;
    const contentCardGlowSx = contentCardSx['&::after'] as Record<string, unknown>;
    const sectionCardSx = styleMap.cvSectionCardSx as Record<string, unknown>;
    const sectionGlowSx = sectionCardSx['&::before'] as Record<string, unknown>;
    const sectionSweepSx = sectionCardSx['&::after'] as Record<string, unknown>;
    const headingTitleTextSx = styleMap.sectionHeadingTitleTextSx as Record<string, unknown>;
    const entryChipSx = styleMap.cvEntryChipSx as Record<string, unknown>;
    const entryChipPulseSx = entryChipSx['&::after'] as Record<string, unknown>;

    expect(tabHoverAfterSx.animation).toEqual(expect.stringContaining('500ms linear'));
    expect((gitHubChipSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect(gitHubChipHoverAfterSx.animation).toEqual(expect.stringContaining('500ms linear'));
    expect((styleMap.supportAccentInteractiveSurfaceSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect(chipWaveSx.animation).toEqual(expect.stringContaining('8600ms linear infinite'));
    expect((styleMap.getChipWaveDelaySx(2) as Record<string, unknown>).animationDelay).toBe('1.5s');
    expect((styleMap.statusBreatheSx as Record<string, unknown>).animation).toEqual(
      expect.stringContaining('3600ms ease-in-out infinite')
    );
    expect(headingTitleTextSx.animation).toEqual(
      expect.stringContaining('3800ms ease-in-out infinite')
    );
    expect(headingTitleTextSx.animationDelay).toBe('120ms');
    expect(contentCardSx.backdropFilter).toBe('blur(12px)');
    expect(contentCardGlowSx.animation).toEqual(
      expect.stringContaining('8200ms ease-in-out infinite')
    );
    expect(entryChipPulseSx.animation).toEqual(
      expect.stringContaining('5200ms ease-in-out infinite')
    );
    expect(sectionGlowSx.opacity).toBe(0.62);
    expect(sectionGlowSx.animation).toEqual(expect.stringContaining('5600ms ease-in-out infinite'));
    expect(sectionSweepSx.opacity).toBe(0.82);
    expect(sectionSweepSx.animation).toEqual(expect.stringContaining('6800ms linear infinite'));
  });

  it('uses the site default appearance contract when callers request the default preset explicitly', () => {
    const theme = createAppTheme('light', defaultAppAppearanceKey);
    const styleMap = createComponentStyleMap(theme);
    const { getTabSx } = styleMap;
    const tabSx = getTabSx(false) as Record<string, unknown>;
    const contentCardSx = styleMap.contentCardSx as Record<string, unknown>;

    expect(theme.appearanceTreatment.key).toBe(defaultAppAppearanceKey);
    expect((styleMap.sectionHeadingOverlineTextSx as Record<string, unknown>).animationDelay).toBe(
      '0ms'
    );
    expect((styleMap.supportAccentInteractiveSurfaceSx as Record<string, unknown>).color).toBe(
      theme.palette.secondary.main
    );
    expect((tabSx['&::after'] as Record<string, unknown>).background).toEqual(
      expect.stringContaining('linear-gradient')
    );
    expect(contentCardSx.background).toEqual(
      expect.stringContaining(
        alpha(
          theme.palette.secondary.main,
          Math.min(theme.appearanceTreatment.surface.secondaryTintAlpha + 0.02, 0.22)
        )
      )
    );
  });
});
