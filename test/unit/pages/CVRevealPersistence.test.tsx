import { fireEvent, render, screen } from '@testing-library/react';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import CV from '../../../src/pages/CV';

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@mui/material/useScrollTrigger', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

jest.mock('../../../src/hooks/useDocumentMetadata', () => ({
  useDocumentMetadata: jest.fn(),
}));

jest.mock('../../../src/components/cv/CVAboutSection', () => ({
  CVAboutSection: ({
    revealed = false,
    onRevealComplete,
  }: {
    revealed?: boolean;
    onRevealComplete?: () => void;
  }) => (
    <section data-testid="about-section" data-revealed={String(revealed)}>
      <button type="button" onClick={onRevealComplete}>
        Complete about reveal
      </button>
    </section>
  ),
}));

jest.mock('../../../src/components/cv/CVExperienceSection', () => ({
  CVExperienceSection: ({
    revealed = false,
    onReveal,
  }: {
    revealed?: boolean;
    onReveal?: () => void;
  }) => (
    <section data-testid="experience-section" data-revealed={String(revealed)}>
      <button type="button" onClick={onReveal}>
        Reveal experience
      </button>
    </section>
  ),
}));

jest.mock('../../../src/components/cv/CVEducationSection', () => ({
  CVEducationSection: () => <section data-testid="education-section" />,
}));

jest.mock('../../../src/components/cv/CVVolunteeringSection', () => ({
  CVVolunteeringSection: () => <section data-testid="volunteering-section" />,
}));

jest.mock('../../../src/components/cv/CVCertificatesSection', () => ({
  CVCertificatesSection: () => <section data-testid="certificates-section" />,
}));

jest.mock('../../../src/components/cv/CVCodingSection', () => ({
  CVCodingSection: () => <section data-testid="coding-section" />,
}));

jest.mock('../../../src/components/cv/CVGitHubSection', () => ({
  CVGitHubSection: ({
    revealed = false,
    onReveal,
    calendarSettled = false,
    onCalendarSettled,
  }: {
    revealed?: boolean;
    onReveal?: () => void;
    calendarSettled?: boolean;
    onCalendarSettled?: () => void;
  }) => (
    <section
      data-testid="github-section"
      data-revealed={String(revealed)}
      data-calendar-settled={String(calendarSettled)}
    >
      <button type="button" onClick={onReveal}>
        Reveal github
      </button>
      <button type="button" onClick={onCalendarSettled}>
        Settle github calendar
      </button>
    </section>
  ),
}));

jest.mock('../../../src/components/cv/CVStoryHeader', () => ({
  CVStoryHeader: () => <header data-testid="cv-story-header" />,
}));

jest.mock('../../../src/components/cv/CVSectionStack', () => ({
  CVSectionStack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/components/cv/CVSectionNavigator', () => ({
  CVSectionNavigator: () => <nav data-testid="cv-section-navigator" />,
}));

jest.mock('../../../src/components/cv/CVGitHubStatusTooltip', () => ({
  CVGitHubStatusTooltip: () => <div data-testid="github-status-tooltip" />,
}));

jest.mock('../../../src/components/layout/PageFrame', () => ({
  PageFrame: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('../../../src/motion', () => ({
  MotionSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
const mockUseScrollTrigger = useScrollTrigger as jest.MockedFunction<typeof useScrollTrigger>;

describe('CV reveal persistence across responsive remounts', () => {
  const renderCV = () =>
    render(
      <MemoryRouter initialEntries={['/cv']} future={routerFuture}>
        <ThemeProvider>
          <CV />
        </ThemeProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
    mockUseScrollTrigger.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps revealed About, section, and calendar state when switching between desktop and mobile layouts', () => {
    const { rerender } = renderCV();

    expect(screen.getByTestId('about-section')).toHaveAttribute('data-revealed', 'false');
    expect(screen.getByTestId('experience-section')).toHaveAttribute('data-revealed', 'false');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-revealed', 'false');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-calendar-settled', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Complete about reveal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reveal experience' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reveal github' }));
    fireEvent.click(screen.getByRole('button', { name: 'Settle github calendar' }));

    expect(screen.getByTestId('about-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('experience-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-calendar-settled', 'true');

    mockUseMediaQuery.mockReturnValue(true);
    rerender(
      <MemoryRouter initialEntries={['/cv']} future={routerFuture}>
        <ThemeProvider>
          <CV />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('about-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('experience-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-revealed', 'true');
    expect(screen.getByTestId('github-section')).toHaveAttribute('data-calendar-settled', 'true');
  });
});
