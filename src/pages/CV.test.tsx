import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeProvider from '../ThemeProvider';
import { CVSectionKey, cvSectionMetadata, cvSectionNavigationOrder } from '../components/cv/cvSectionMetadata';
import {
  APP_APPEARANCE_STORAGE_KEY,
  defaultAppAppearanceKey,
} from '../theme/appAppearance';
import { cvPageSectionLayout } from './cvPageLayout';
import CV from './CV';

const legacyCvAppearanceStorageKey = 'danhenderson-cv-appearance';
const mockAppSpeedDial = jest.fn();

jest.mock('@mui/material/useMediaQuery', () => jest.fn());

jest.mock('../hooks/useGithubProfile', () => ({
  useGithubProfile: () => ({
    activity: [{ label: 'Pushed 2 commits to owner/repo', href: 'https://github.com/owner/repo' }],
    projects: [{ name: 'portfolio-site', url: 'https://github.com/danphenderson/dev-danhenderson' }],
    contributions: [{ name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright', stars: 999 }],
    loading: false,
    error: null,
  }),
}));

jest.mock('react-github-calendar', () => ({
  GitHubCalendar: () => <div data-testid="github-calendar" />,
}));

jest.mock('../components/AnimatedContentCard', () => ({
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

jest.mock('../components/AppSpeedDial', () => ({
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
  ),
}));

jest.mock('../components/BackToTopButton', () => ({
  BackToTopButton: () => <div data-testid="back-to-top-button" />,
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('CV page section navigation', () => {
  const scrollIntoViewMock = jest.fn();
  let getElementByIdSpy: jest.SpyInstance;

  const getAnimatedSectionCard = (sectionKey: CVSectionKey) =>
    screen.getByTestId(`animated-card-${cvSectionMetadata[sectionKey].id}`);

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
  });

  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    scrollIntoViewMock.mockClear();
    window.localStorage.removeItem(APP_APPEARANCE_STORAGE_KEY);
    window.localStorage.removeItem(legacyCvAppearanceStorageKey);
    getElementByIdSpy = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.clearAllMocks();
    getElementByIdSpy.mockRestore();
  });

  it('renders the desktop top row and both desktop columns while preserving the desktop motion contract', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const desktopTopRegion = screen.getByTestId('cv-desktop-top-region');
    const desktopSidebarRegion = screen.getByTestId('cv-desktop-sidebar-region');
    const desktopMainRegion = screen.getByTestId('cv-desktop-main-region');

    expect(within(desktopTopRegion).getByTestId(`animated-card-${cvSectionMetadata.about.id}`)).toBeInTheDocument();
    expect(within(desktopSidebarRegion).getByTestId(`animated-card-${cvSectionMetadata.github.id}`)).toBeInTheDocument();
    expect(
      within(desktopSidebarRegion).getByTestId(`animated-card-${cvSectionMetadata.certificates.id}`)
    ).toBeInTheDocument();
    expect(within(desktopSidebarRegion).getByTestId(`animated-card-${cvSectionMetadata.tools.id}`)).toBeInTheDocument();
    expect(within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.experience.id}`)).toBeInTheDocument();
    expect(within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.education.id}`)).toBeInTheDocument();
    expect(
      within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.volunteering.id}`)
    ).toBeInTheDocument();
    expect(within(desktopMainRegion).getByTestId(`animated-card-${cvSectionMetadata.coding.id}`)).toBeInTheDocument();

    (Object.keys(cvPageSectionLayout) as CVSectionKey[]).forEach((sectionKey) => {
      const { delayMs, triggerOnView } = cvPageSectionLayout[sectionKey].desktop;

      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute('data-delay-ms', `${delayMs}`);
      expect(getAnimatedSectionCard(sectionKey)).toHaveAttribute(
        'data-trigger-on-view',
        String(triggerOnView)
      );
    });
  });

  it('renders ABOUT actions and docks the section navigator below the ABOUT section on desktop', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const aboutDial = screen.getByTestId('speed-dial-open-about-actions');
    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(
      within(aboutDial).getAllByTestId('speed-dial-action').map((action) => action.getAttribute('aria-label'))
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
    expect(mockAppSpeedDial).toHaveBeenCalledWith(expect.objectContaining({
      ariaLabel: 'Open about actions',
      sx: expect.objectContaining({
        position: 'static',
      }),
    }));
    expect(aboutSection).not.toBeNull();

    const stickyNavigator = screen.getByTestId('cv-sticky-section-navigator');
    const navigator = within(stickyNavigator).getByTestId('cv-section-navigator');
    const navigationActions = within(navigator).getAllByRole('button');

    expect(within(aboutSection!).queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
    expect(aboutSection!.compareDocumentPosition(stickyNavigator) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(stickyNavigator.compareDocumentPosition(screen.getByTestId('cv-desktop-sidebar-region')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(navigationActions.map((action) => action.textContent)).toEqual(
      cvSectionNavigationOrder.map((sectionKey) => cvSectionMetadata[sectionKey].navLabel)
    );
    expect(within(navigator).queryByRole('button', { name: 'About' })).not.toBeInTheDocument();
    expect(within(navigator).getByText('Sections')).toBeInTheDocument();

    navigationActions.forEach((action, index) => {
      const expectedSectionId = cvSectionMetadata[cvSectionNavigationOrder[index]].id;

      fireEvent.click(action);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(getElementByIdSpy).toHaveBeenLastCalledWith(expectedSectionId);
    });
  });

  it('renders the shared back-to-top control on the cv route', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(screen.getByTestId('back-to-top-button')).toBeInTheDocument();
  });

  it('ignores the legacy CV appearance key and uses the global default appearance key', () => {
    window.localStorage.setItem(legacyCvAppearanceStorageKey, 'atlas');

    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(aboutSection).not.toBeNull();
    expect(within(aboutSection!).queryByText('Style Preview')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe(defaultAppAppearanceKey);
  });

  it('respects the stored global appearance option on load', () => {
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, 'atlas');

    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const aboutSection = document.getElementById(cvSectionMetadata.about.id);

    expect(aboutSection).not.toBeNull();
    expect(within(aboutSection!).queryByText('Style Preview')).not.toBeInTheDocument();
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe('atlas');
  });

  it('renders the mobile stacked order and keeps ABOUT ahead of EXPERIENCE with the current mobile motion contract', () => {
    mockUseMediaQuery.mockReturnValue(true);

    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

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
    const stickyNavigator = screen.getByTestId('cv-sticky-section-navigator');
    const navigator = within(stickyNavigator).getByTestId('cv-section-navigator');

    expect(aboutSection).not.toBeNull();
    expect(experienceSection).not.toBeNull();
    expect(aboutSection!.compareDocumentPosition(experienceSection!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(aboutSection!).queryByTestId('cv-section-navigator')).not.toBeInTheDocument();
    expect(aboutDial.compareDocumentPosition(stickyNavigator) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(stickyNavigator.compareDocumentPosition(experienceSection!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      within(navigator).getAllByRole('button').map((action) => action.textContent)
    ).toEqual(cvSectionNavigationOrder.map((sectionKey) => cvSectionMetadata[sectionKey].navLabel));
    expect(within(navigator).getByText('Sections')).toBeInTheDocument();
  });
});
