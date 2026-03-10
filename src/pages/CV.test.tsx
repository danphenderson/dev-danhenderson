import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import ThemeProvider from '../ThemeProvider';
import { cvProductivitySectionOrder, cvSectionMetadata } from '../components/cv/cvSectionMetadata';
import CV from './CV';

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
  }: {
    children: ReactNode;
    id?: string;
  }) => <div id={id}>{children}</div>,
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

describe('CV page speed dial integration', () => {
  const scrollIntoViewMock = jest.fn();
  let getElementByIdSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
  });

  beforeEach(() => {
    scrollIntoViewMock.mockClear();
    getElementByIdSpy = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    getElementByIdSpy.mockRestore();
  });

  it('renders ABOUT actions and ordered productivity jumps, then scrolls to the right section ids', () => {
    render(
      <ThemeProvider>
        <CV />
      </ThemeProvider>
    );

    const aboutDial = screen.getByTestId('speed-dial-open-about-actions');
    const productivityDial = screen.getByTestId('speed-dial-open-cv-section-navigation');

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

    const productivityActions = within(productivityDial).getAllByTestId('speed-dial-action');

    expect(productivityActions.map((action) => action.getAttribute('aria-label'))).toEqual(
      cvProductivitySectionOrder.map((sectionKey) => cvSectionMetadata[sectionKey].label)
    );

    productivityActions.forEach((action, index) => {
      const expectedSectionId = cvSectionMetadata[cvProductivitySectionOrder[index]].id;

      fireEvent.click(action);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
      expect(getElementByIdSpy).toHaveBeenLastCalledWith(expectedSectionId);
    });
  });
});
