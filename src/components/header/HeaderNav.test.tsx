import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../../ThemeProvider';
import { HeaderNav } from './HeaderNav';

const pages = [
  { name: 'CV', path: '/cv' },
  { name: 'Climbing', path: '/climbing' },
];

describe('HeaderNav', () => {
  it('renders desktop navigation buttons for each page', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <HeaderNav
            pages={pages}
            isMobile={false}
            iconButtonSize="medium"
            headerIconSx={{ fontSize: 24 }}
            mobileMenuOpen={false}
            mobileMenuAnchor={null}
            onMobileMenuOpen={jest.fn()}
            onMobileMenuClose={jest.fn()}
          />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Go to CV' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Climbing' })).toBeInTheDocument();
  });

  it('renders the mobile menu button when isMobile is true', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <HeaderNav
            pages={pages}
            isMobile={true}
            iconButtonSize="medium"
            headerIconSx={{ fontSize: 24 }}
            mobileMenuOpen={false}
            mobileMenuAnchor={null}
            onMobileMenuOpen={jest.fn()}
            onMobileMenuClose={jest.fn()}
          />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: 'Open navigation menu' })).toBeInTheDocument();
  });

  it('calls onMobileMenuOpen when the mobile menu button is clicked', () => {
    const onMobileMenuOpen = jest.fn();

    render(
      <ThemeProvider>
        <MemoryRouter>
          <HeaderNav
            pages={pages}
            isMobile={true}
            iconButtonSize="medium"
            headerIconSx={{ fontSize: 24 }}
            mobileMenuOpen={false}
            mobileMenuAnchor={null}
            onMobileMenuOpen={onMobileMenuOpen}
            onMobileMenuClose={jest.fn()}
          />
        </MemoryRouter>
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));

    expect(onMobileMenuOpen).toHaveBeenCalledTimes(1);
  });

  it('renders leftContent when provided', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <HeaderNav
            pages={pages}
            isMobile={false}
            iconButtonSize="medium"
            headerIconSx={{ fontSize: 24 }}
            mobileMenuOpen={false}
            mobileMenuAnchor={null}
            onMobileMenuOpen={jest.fn()}
            onMobileMenuClose={jest.fn()}
            leftContent={<span data-testid="left-content">Logo</span>}
          />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByTestId('left-content')).toBeInTheDocument();
  });
});
