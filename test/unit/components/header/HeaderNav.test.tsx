import { fireEvent, render, screen, within } from '@testing-library/react';
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

const renderOpenMobileMenu = (currentPath: string, overrides: Partial<typeof defaultProps> = {}) =>
  renderNav({
    currentPath,
    isMobile: true,
    mobileMenuOpen: true,
    mobileMenuAnchor: document.body,
    ...overrides,
  });

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
    expect(screen.getByAltText('Daniel Henderson')).toBeInTheDocument();
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
    renderOpenMobileMenu('/cv');

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.map((item) => item.textContent)).toEqual(['Climbing', 'Photography', 'Home']);
    expect(screen.queryByRole('menuitem', { name: 'CV' })).not.toBeInTheDocument();

    const climbingItem = screen.getByRole('menuitem', { name: 'Climbing' });
    expect(within(climbingItem).getByTestId('TerrainIcon')).toBeInTheDocument();

    const photographyItem = screen.getByRole('menuitem', { name: 'Photography' });
    expect(within(photographyItem).getByTestId('CameraAltIcon')).toBeInTheDocument();

    const homeItem = screen.getByRole('menuitem', { name: 'Daniel Henderson Home' });
    expect(within(homeItem).getByAltText('Daniel Henderson')).toBeInTheDocument();
    expect(within(homeItem).getByText('Home')).toBeInTheDocument();
  });

  it('shows the mobile menu links for the non-home pages when on the home route', () => {
    renderOpenMobileMenu('/');

    expect(screen.getByRole('menuitem', { name: 'CV' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Photography' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Home' })).not.toBeInTheDocument();
  });

  it('uses the correct mobile menu icons for the home route destinations', () => {
    renderOpenMobileMenu('/');

    expect(
      within(screen.getByRole('menuitem', { name: 'CV' })).getByTestId('DescriptionIcon')
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('menuitem', { name: 'Climbing' })).getByTestId('TerrainIcon')
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('menuitem', { name: 'Photography' })).getByTestId('CameraAltIcon')
    ).toBeInTheDocument();
  });

  it('excludes the current photography route from the mobile menu on detail pages', () => {
    renderOpenMobileMenu('/photography/landscape');

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.map((item) => item.textContent)).toEqual(['CV', 'Climbing', 'Home']);
    expect(screen.queryByRole('menuitem', { name: 'Photography' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'CV' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Climbing' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Daniel Henderson Home' })).toBeInTheDocument();
  });

  it('closes the mobile menu when a destination is selected', () => {
    const onMobileMenuClose = jest.fn();

    renderOpenMobileMenu('/cv', { onMobileMenuClose });

    fireEvent.click(screen.getByRole('menuitem', { name: 'Photography' }));

    expect(onMobileMenuClose).toHaveBeenCalledTimes(1);
  });
});
