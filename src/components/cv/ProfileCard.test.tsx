import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { ProfileCard } from './ProfileCard';
import type { AboutMe } from '../../data/cv';

const baseAbout: AboutMe = {
  name: 'Test User',
  title: 'Software Engineer',
  email: 'test@example.com',
  phone: '',
  location: 'Seattle, WA',
  bio: 'A developer with experience in React and TypeScript.',
};

describe('ProfileCard', () => {
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

  it('renders bio text', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} />
      </ThemeProvider>
    );

    expect(screen.getByText('A developer with experience in React and TypeScript.')).toBeInTheDocument();
  });

  it('embeds a link within bio text when bioLink is provided', () => {
    const aboutWithLink: AboutMe = {
      ...baseAbout,
      bio: 'Currently an M.S. student studying math.',
      bioLink: {
        text: 'M.S. student',
        url: 'https://example.com/program',
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
  });

  it('renders avatar when avatarSrc is provided', () => {
    render(
      <ThemeProvider>
        <ProfileCard about={baseAbout} avatarSrc="/avatar.jpg" />
      </ThemeProvider>
    );

    expect(screen.getByAltText('Test User')).toBeInTheDocument();
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
