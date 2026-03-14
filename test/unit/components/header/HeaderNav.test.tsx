import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../../../src/ThemeProvider';
import { routerFuture } from '../../../../src/routerFuture';
import { HeaderNav } from '../../../../src/components/header/HeaderNav';

const pages = [
  { name: 'CV', path: '/cv' },
  { name: 'Climbing', path: '/climbing' },
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
  });

  it('always renders the avatar home link', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Daniel Henderson' })).toBeInTheDocument();
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

  it('shows the avatar home link on mobile', () => {
    renderNav({ isMobile: true });

    expect(screen.getByRole('link', { name: 'Go to Home' })).toBeInTheDocument();
  });
});
