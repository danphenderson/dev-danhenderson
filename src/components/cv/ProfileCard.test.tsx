import { render, screen } from '@testing-library/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import ThemeProvider from '../../ThemeProvider';
import { ProfileCard } from './ProfileCard';
import { COMMON_LINK_TOOLTIP_ID } from '../CommonLink';
import type { AboutMe } from '../../types/cv';
import { createAppTheme } from '../../theme/createAppTheme';

let mockPrefersReducedMotion = true;

jest.mock('../../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockPrefersReducedMotion,
}));

const baseAbout: AboutMe = {
  name: 'Test User',
  title: 'Software Engineer',
  email: 'test@example.com',
  phone: '',
  location: 'Seattle, WA',
  bio: 'A developer with experience in React and TypeScript.',
};

describe('ProfileCard', () => {
  beforeEach(() => {
    mockPrefersReducedMotion = true;
  });

  it('renders name, title, and location', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} />
      </ThemeProvider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument();
  });

  it('renders actions in the profile header without affecting profile details', () => {
    render(
      <ThemeProvider>
        <ProfileCard
          about={baseAbout}
          actions={<button type="button">Open about actions</button>}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Open about actions' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test User' })).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Seattle, WA')).toBeInTheDocument();
  });

  it('renders actions even when location is omitted', () => {
    render(
      <ThemeProvider>
        <ProfileCard
          about={{ ...baseAbout, location: '' }}
          actions={<button type="button">Open about actions</button>}
        />
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Open about actions' })).toBeInTheDocument();
    expect(screen.queryByText('Seattle, WA')).not.toBeInTheDocument();
  });

  it('renders bio text', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} />
      </ThemeProvider>
    );

    expect(
      screen.getByText('A developer with experience in React and TypeScript.')
    ).toBeInTheDocument();
  });

  it('embeds a link within bio text when bioLink is provided', () => {
    const aboutWithLink: AboutMe = {
      ...baseAbout,
      bio: 'Currently an M.S. student studying math.',
      bioLink: {
        text: 'M.S. student',
        url: 'https://example.com/program',
        tooltip: 'View the graduate program page.',
      },
    };

    render(
      <ThemeProvider>
        <ProfileCard about={aboutWithLink} />
      </ThemeProvider>
    );

    const link = screen.getByRole('link', { name: 'M.S. student' });
    expect(link).toHaveAttribute('href', 'https://example.com/program');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('data-tooltip-id', COMMON_LINK_TOOLTIP_ID);
    expect(link).toHaveAttribute('data-tooltip-content', 'View the graduate program page.');
  });

  it('renders avatar when avatarSrc is provided', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} avatarSrc="/avatar.jpg" />
      </ThemeProvider>
    );

    expect(screen.getByAltText('Test User')).toBeInTheDocument();
  });

  it('uses the support accent for the status line on CV themes', () => {
    const cvTheme = createAppTheme('light', 'evergreen');

    render(
      <MuiThemeProvider theme={cvTheme}>
        <ProfileCard
          about={{
            ...baseAbout,
            bio: 'Systems engineer.\nOpen to opportunities in scientific computing.',
          }}
        />
      </MuiThemeProvider>
    );

    const statusText = screen.getByText(/Open to opportunities/i);
    const probe = document.createElement('div');

    probe.style.color = cvTheme.palette.secondary.main;
    document.body.appendChild(probe);
    const expectedColor = getComputedStyle(probe).color;
    probe.remove();

    expect(getComputedStyle(statusText).color).toBe(expectedColor);
  });

  it('omits avatar when avatarSrc is not provided', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} />
      </ThemeProvider>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
