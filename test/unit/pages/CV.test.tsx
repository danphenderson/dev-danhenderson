import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeProvider from '../../../src/ThemeProvider';
import {
  CVSectionKey,
  cvSectionMetadata,
  cvSectionNavigationOrder,
} from '../../../src/components/cv/cvSectionMetadata';
import {
  APP_APPEARANCE_STORAGE_KEY,
  defaultAppAppearanceKey,
} from '../../../src/theme/appAppearance';
import { cvPageSectionLayout } from '../../../src/pages/cvPageLayout';
import CV from '../../../src/pages/CV';

const legacyCvAppearanceStorageKey = 'danhenderson-cv-appearance';
const mockAppSpeedDial = jest.fn();

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('../../../src/hooks/useGithubProfile', () => ({
  useGithubProfile: () => ({
    activity: [{ label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' }],
    contributions: [
      { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright', stars: 999 },
    ],
    loading: false,
    error: null,
    status: {
      source: 'remote',
      loading: false,
      error: null,
      isFallback: false,
      reason: 'live-fetch',
      freshness: {
        label: 'GitHub activity was fetched live and cached for subsequent visits.',
        lastUpdated: '2026-03-14T16:45:00.000Z',
        isStale: false,
      },
    },
  }),
}));

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: () => <div data-testid="github-calendar" />,
}));

jest.mock('../../../src/components/AnimatedContentCard', () => ({
  ANIMATED_CARD_DURATION_MS: 0,
  AnimatedContentCard: ({
    children,
    id,
    delayMs,
    triggerOnView,
  }: {
    children: ReactNode;
    id?: string;
    delayMs?: number;
    triggerOnView?: boolean;
  }) => (
    <div
      id={id}
      data-testid={id ? `animated-card-${id}` : 'animated-card'}
      data-delay-ms={delayMs ?? 0}
      data-trigger-on-view={String(triggerOnView ?? true)}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../../src/components/AppSpeedDial', () => ({
  AppSpeedDial: ({
    ariaLabel,
    actions,
    sx,
  }: {
    ariaLabel: string;
    actions: Array<{
      id: string;
      label: string;
      href?: string;
      download?: string | boolean;
      onClick?: () => void;
    }>;
    sx?: unknown;
  }) => (
    mockAppSpeedDial({ ariaLabel, actions, sx }),
    (
      <section data-testid={`speed-dial-${ariaLabel.toLowerCase().replace(/\s+/g, '-')}`}>
        {actions.map((action) =>
          action.href ? (
            <a
              key={action.id}
              data-testid="speed-dial-action"
              aria-label={action.label}
              href={action.href}
              download={typeof action.download === 'string' ? action.download : undefined}
            >
              {action.label}
            </a>
          ) : (
            <button
              key={action.id}
              type="button"
              data-testid="speed-dial-action"
              aria-label={action.label}
              onClick={() => action.onClick?.()}
            >
              {action.label}
            </button>
          )
        )}
      </section>
    )
  ),
}));

jest.mock('../../../src/components/cv/CVSectionNavigator', () => ({
  CVSectionNavigator: ({ sections, testId }: { sections: string[]; testId?: string }) => (
    <nav data-testid={testId} aria-label="CV section navigation" data-sections={sections.join(',')}>
      <div data-testid="cv-floating-section-dial" />
    </nav>
  ),
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('CV page section navigation', () => {
  const getAnimatedSectionCard = (sectionKey: CVSectionKey) =>
    screen.getByTestId(`animated-card-${cvSectionMetadata[sectionKey].id}`);

  const renderCV = (initialEntries = ['/cv']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>
          <CV />
        </ThemeProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    window.localStorage.removeItem(APP_APPEARANCE_STORAGE_KEY);
    window.localStorage.removeItem(legacyCvAppearanceStorageKey);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the desktop top row and both desktop columns while preserving the desktop motion contract', () => {
    renderCV();

    const desktopTopRegion = screen.getByTestId('cv-desktop-top-region');
    const desktopSidebarRegion = screen.getByTestId('cv-desktop-sidebar-region');
    const desktopMainRegion = screen.getByTestId('cv-desktop-main-region');

    expect(
      within(desktopTopRegion).getByTestId(`animated-card-${cvSectionMetadata.about.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopSidebarRegion).getByTestId(`animated-card-${cvSectionMetadata.github.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopSidebarRegion).getByTestId(`animated-card-${cvSectionMetadata.certificates.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.experience.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.education.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.volunteering.id}`)
    ).toBeInTheDocument();
    expect(
      within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.coding.id}`)
    ).toBeInTheDocument();

    (Object.keys(cvPageSectionLayout) as CVSectionKey[]).forEach((sectionKey) => {
      const { delayMs, triggerOnView } = cvPageSectionLayout[sectionKey].desktop;

      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute('data-delay-ms', `${delayMs}`);
      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute(
        'data-trigger-on-view',
        String(triggerOnView)
      );
    });
  });

  it('renders ABOUT actions and places a floating section navigator at the route root', () => {
    renderCV();

    const aboutDial = screen.getByTestId('speed-dial-open-about-actions');
    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(
      within(aboutDial)
        .getAllByTestId('speed-dial-action')
        .map((action) => action.getAttribute('aria-label'))
    ).toEqual(['GitHub', 'LinkedIn', 'Email', 'Download Resume']);
    expect(within(aboutDial).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/danphenderson'
    );
    expect(within(aboutDial).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/daniel-henderson-6a9485bb/'
    );
    expect(within(aboutDial).getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      'mailto:me@danhenderson.dev'
    );
    expect(within(aboutDial).getByRole('link', { name: 'Download Resume' })).toHaveAttribute(
      'download',
      'Daniel-Henderson-Resume.pdf'
    );
    expect(within(aboutSection!).getByText('Daniel Henderson')).toBeInTheDocument();
    expect(mockAppSpeedDial).toHaveBeenCalledWith(
      expect.objectContaining({
        ariaLabel: 'Open about actions',
        sx: expect.objectContaining({
          position: 'static',
        }),
      })
    );
    expect(aboutSection).not.toBeNull();

    const navigator = screen.getByTestId('cv-section-navigator');
    const desktopSidebarRegion = screen.getByTestId('cv-desktop-sidebar-region');

    expect(screen.queryByTestId('cv-sticky-section-navigator')).not.toBeInTheDocument();
    expect(within(aboutSection!).queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
    expect(
      within(desktopSidebarRegion).queryByTestId('cv-section-navigator')
    ).not.toBeInTheDocument();
    expect(navigator.getAttribute('data-sections')).toBe(cvSectionNavigationOrder.join(','));
    expect(screen.getByTestId('cv-floating-section-dial')).toBeInTheDocument();
  });

  it('renders the floating section navigator as the CV route navigation control', () => {
    renderCV();

    const navigator = screen.getByTestId('cv-section-navigator');

    expect(navigator).toBeInTheDocument();
    expect(navigator).toHaveAttribute('aria-label', 'CV section navigation');
    expect(navigator.getAttribute('data-sections')).toBe(cvSectionNavigationOrder.join(','));
  });

  it('renders the GitHub section without the removed projects subsection', () => {
    renderCV();

    const githubSection = document.getElementById(cvSectionMetadata.github.id);

    expect(githubSection).not.toBeNull();
    expect(within(githubSection!).getByText('GitHub')).toBeInTheDocument();
    expect(
      within(githubSection!).getByText(
        'Recent activity, open-source contributions, and contribution history from GitHub.'
      )
    ).toBeVisible();
    expect(within(githubSection!).getByText('Recent Activity')).toBeInTheDocument();
    expect(within(githubSection!).getByText('Contributions')).toBeInTheDocument();
    expect(within(githubSection!).getByText('Contribution calendar')).toBeInTheDocument();
    expect(within(githubSection!).getByText('Data status')).toBeInTheDocument();
    expect(
      within(githubSection!).getByText(
        'Showing live GitHub activity from the latest successful fetch.'
      )
    ).toBeInTheDocument();
    expect(within(githubSection!).getByText('Pushed 2 commits to owner/repo')).toBeInTheDocument();
    expect(within(githubSection!).getByText('microsoft/playwright')).toBeInTheDocument();
    expect(within(githubSection!).queryByText('Projects')).not.toBeInTheDocument();
    expect(within(githubSection!).queryByText('Public Projects')).not.toBeInTheDocument();
  });

  it('ignores the legacy CV appearance key and uses the global default appearance key', () => {
    window.localStorage.setItem(legacyCvAppearanceStorageKey, 'atlas');

    renderCV();

    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(aboutSection).not.toBeNull();
    expect(within(aboutSection!).queryByText('Style Preview')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe(defaultAppAppearanceKey);
  });

  it('respects the stored global appearance option on load', () => {
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, 'atlas');

    renderCV();

    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(aboutSection).not.toBeNull();
    expect(within(aboutSection!).queryByText('Style Preview')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe('atlas');
  });

  it('renders the mobile stacked order and keeps ABOUT ahead of EXPERIENCE with the current mobile motion contract', () => {
    mockUseMediaQuery.mockReturnValue(true);

    renderCV();

    const orderedMobileSections = Object.entries(cvPageSectionLayout)
      .sort((left, right) => left[1].mobile.order - right[1].mobile.order)
      .map(([key]) => key as CVSectionKey);

    orderedMobileSections.forEach((sectionKey) => {
      const { delayMs, triggerOnView } = cvPageSectionLayout[sectionKey].mobile;

      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute('data-delay-ms', `${delayMs}`);
      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute(
        'data-trigger-on-view',
        String(triggerOnView)
      );
    });

    const aboutSection = document.getElementById(cvSectionMetadata.about.id);
    const experienceSection = document.getElementById(cvSectionMetadata.experience.id);
    const aboutDial = screen.getByTestId('speed-dial-open-about-actions');
    const navigator = screen.getByTestId('cv-section-navigator');

    expect(aboutSection).not.toBeNull();
    expect(experienceSection).not.toBeNull();
    expect(
      aboutSection!.compareDocumentPosition(experienceSection!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.queryByTestId('cv-sticky-section-navigator')).not.toBeInTheDocument();
    expect(within(aboutSection!).queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
    expect(
      aboutDial.compareDocumentPosition(navigator) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(navigator.getAttribute('data-sections')).toBe(cvSectionNavigationOrder.join(','));
  });

  it('renders story mode layout when ?mode=story is set', () => {
    renderCV(['/cv?mode=story']);

    expect(screen.getByTestId('cv-story-layout')).toBeInTheDocument();
    expect(screen.getByTestId('cv-story-header')).toBeInTheDocument();
    expect(screen.getByText('Story Mode')).toBeInTheDocument();
    expect(screen.getByTestId('cv-mode-toggle')).toHaveTextContent('Switch to full CV');
    expect(screen.queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cv-desktop-top-region')).not.toBeInTheDocument();
  });

  it('renders all story chapters with headings and narrative', () => {
    renderCV(['/cv?mode=story']);

    expect(screen.getByTestId('cv-story-chapter-origin')).toBeInTheDocument();
    expect(screen.getByText('The Starting Point')).toBeInTheDocument();
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();

    expect(screen.getByTestId('cv-story-chapter-career')).toBeInTheDocument();
    expect(screen.getByText('Professional Path')).toBeInTheDocument();

    expect(screen.getByTestId('cv-story-chapter-craft')).toBeInTheDocument();
    expect(screen.getByText('Code in Practice')).toBeInTheDocument();
  });

  it('renders the default mode with a story toggle when ?mode is absent', () => {
    renderCV();

    expect(screen.getByTestId('cv-story-header')).toBeInTheDocument();
    expect(screen.getByText('Full CV')).toBeInTheDocument();
    expect(screen.getByTestId('cv-mode-toggle')).toHaveTextContent('Read my story');
    expect(screen.queryByTestId('cv-story-layout')).not.toBeInTheDocument();
    expect(screen.getByTestId('cv-desktop-top-region')).toBeInTheDocument();
  });
});
