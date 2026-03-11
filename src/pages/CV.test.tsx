import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThemeProvider from '../ThemeProvider';
import { cvSectionMetadata, cvSectionNavigationOrder } from '../components/cv/cvSectionMetadata';
import CV from './CV';

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
  }: {
    ariaLabel: string;
    actions: Array<{
      id: string;
      label: string;
      href?: string;
      download?: string | boolean;
      onClick?: () => void;
    }>;
  }) => (
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

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('CV page section navigation', () => {
  const scrollIntoViewMock = jest.fn();
  let getElementByIdSpy: jest.SpyInstance;
  const getAnimatedSectionCard = (sectionKey: keyof typeof cvSectionMetadata) =>
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
    getElementByIdSpy = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.clearAllMocks();
    getElementByIdSpy.mockRestore();
  });

  it('loads ABOUT and EXPERIENCE immediately on desktop while preserving the staggered sequence for later sections', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    expect(getAnimatedSectionCard('about')).toHaveAttribute('data-delay-ms', '0');
    expect(getAnimatedSectionCard('about')).toHaveAttribute('data-trigger-on-view', 'false');
    expect(getAnimatedSectionCard('experience')).toHaveAttribute('data-delay-ms', '0');
    expect(getAnimatedSectionCard('experience')).toHaveAttribute('data-trigger-on-view', 'false');

    expect(getAnimatedSectionCard('github')).toHaveAttribute('data-delay-ms', '120');
    expect(getAnimatedSectionCard('github')).toHaveAttribute('data-trigger-on-view', 'true');
    expect(getAnimatedSectionCard('education')).toHaveAttribute('data-delay-ms', '120');
    expect(getAnimatedSectionCard('education')).toHaveAttribute('data-trigger-on-view', 'true');
    expect(getAnimatedSectionCard('certificates')).toHaveAttribute('data-delay-ms', '240');
    expect(getAnimatedSectionCard('volunteering')).toHaveAttribute('data-delay-ms', '240');
    expect(getAnimatedSectionCard('tools')).toHaveAttribute('data-delay-ms', '360');
    expect(getAnimatedSectionCard('coding')).toHaveAttribute('data-delay-ms', '360');
  });

  it('renders ABOUT actions and ordered desktop navigation chips, then scrolls to the right section ids', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const aboutDial = screen.getByTestId('speed-dial-open-about-actions');
    const desktopNavigator = screen.getByTestId('cv-section-navigator-desktop');

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
    expect(screen.queryByTestId('cv-section-navigator-mobile')).not.toBeInTheDocument();

    const navigationActions = within(desktopNavigator).getAllByRole('button');

    expect(navigationActions.map((action) => action.textContent)).toEqual(
      cvSectionNavigationOrder.map((sectionKey) => cvSectionMetadata[sectionKey].navLabel)
    );

    navigationActions.forEach((action, index) => {
      const expectedSectionId = cvSectionMetadata[cvSectionNavigationOrder[index]].id;

      fireEvent.click(action);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(getElementByIdSpy).toHaveBeenLastCalledWith(expectedSectionId);
    });
  });

  it('renders the mobile chip navigator inline between the about section and the main CV sections', () => {
    mockUseMediaQuery.mockReturnValue(true);

    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const mobileNavigator = screen.getByTestId('cv-section-navigator-mobile');
    const aboutSection = document.getElementById(cvSectionMetadata.about.id);
    const experienceSection = document.getElementById(cvSectionMetadata.experience.id);

    expect(mobileNavigator).toBeInTheDocument();
    expect(screen.queryByTestId('cv-section-navigator-desktop')).not.toBeInTheDocument();
    expect(aboutSection).not.toBeNull();
    expect(experienceSection).not.toBeNull();
    expect(aboutSection!.compareDocumentPosition(mobileNavigator) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(mobileNavigator.compareDocumentPosition(experienceSection!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      within(mobileNavigator).getAllByRole('button').map((action) => action.textContent)
    ).toEqual(cvSectionNavigationOrder.map((sectionKey) => cvSectionMetadata[sectionKey].navLabel));
  });
});
