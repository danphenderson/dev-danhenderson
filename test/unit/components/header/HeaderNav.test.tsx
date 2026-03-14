import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { routerFuture } from '../../../../src/routerFuture';
import { HeaderNav } from '../../../../src/components/header/HeaderNav';

const pages = [
  { name: 'CV', path: '/cv' },
  { name: 'Climbing', path: '/climbing' },
  { name: 'Photography', path: '/photography' },
];

const defaultProps = {
  pages,
  currentPath: '/',
  isMobile: false,
  iconButtonSize: 'medium' as const,
  headerIconSx: { fontSize: 24 },
  avatarSrc: '/test-avatar.jpg',
  mobileMenuOpen: false,
  mobileMenuAnchor: null as HTMLElement | null,
  onMobileMenuOpen: jest.fn(),
  onMobileMenuClose: jest.fn(),
};

const renderNav = (overrides: Partial<typeof defaultProps> = {}) =>
  render(
    <ThemeProvider>
      <MemoryRouter future={routerFuture}>
        <HeaderNav {...defaultProps} {...overrides} />
      </MemoryRouter>
    </ThemeProvider>
  );

describe('HeaderNav', () => {
  it('renders desktop navigation buttons for each page', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Go to CV' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Photography' })).toBeInTheDocument();
  });

  it('renders the avatar home link away from the home route', () => {
    renderNav({ currentPath: '/cv' });

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Daniel Henderson' })).toBeInTheDocument();
  });

  it('hides the avatar home link on the home route', () => {
    renderNav();

    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Daniel Henderson' })).not.toBeInTheDocument();
  });

  it('hides desktop navigation links on mobile', () => {
    renderNav({ isMobile: true });

    expect(screen.queryByRole('link', { name: 'Go to CV' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Climbing' })).not.toBeInTheDocument();
  });

  it('renders the mobile menu button when isMobile is true', () => {
    renderNav({ isMobile: true });

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
  });

  it('calls onMobileMenuOpen when the mobile menu button is clicked', () => {
    const onMobileMenuOpen = jest.fn();

    renderNav({ isMobile: true, onMobileMenuOpen });

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));

    expect(onMobileMenuOpen).toHaveBeenCalledTimes(1);
  });

  it('applies active styling to the current page link', () => {
    renderNav({ currentPath: '/cv' });

    const cvLink = screen.getByRole('link', { name: 'Go to CV' });
    expect(cvLink).toHaveAttribute('aria-current', 'page');

    const climbingLink = screen.getByRole('link', { name: 'Go to Climbing' });
    expect(climbingLink).not.toHaveAttribute('aria-current');
  });

  it('does not show the avatar home link on mobile away from the home route', () => {
    renderNav({ currentPath: '/cv', isMobile: true });

    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
  });

  it('hides the avatar home link on mobile for the home route', () => {
    renderNav({ isMobile: true });

    expect(screen.queryByRole('link', { name: 'Go to Home' })).not.toBeInTheDocument();
  });

  it('shows the mobile menu links for the non-current pages including home', () => {
    renderNav({
      currentPath: '/cv',
      isMobile: true,
      mobileMenuOpen: true,
      mobileMenuAnchor: document.body,
    });

    expect(screen.queryByRole('link', { name: 'CV' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Photography' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Daniel Henderson' })).toBeInTheDocument();
  });

  it('keeps the home route mobile menu focused on the non-home pages', () => {
    renderNav({
      currentPath: '/',
      isMobile: true,
      mobileMenuOpen: true,
      mobileMenuAnchor: document.body,
    });

    expect(screen.getByRole('link', { name: 'CV' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Photography' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });
});
