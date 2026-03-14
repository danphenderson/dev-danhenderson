import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../routerFuture';
import ThemeProvider from '../ThemeProvider';
import NotFound from './NotFound';

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="background-paper">{children}</div>
  ),
}));

describe('NotFound', () => {
  it('renders 404 Not Found message with descriptive text', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
  });

  it('renders navigation links to Home, CV, and Photography', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'Photography' })).toHaveAttribute(
      'href',
      '/photography'
    );
  });

  it('renders the Home link as a contained button and others as outlined', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const cvLink = screen.getByRole('link', { name: 'CV' });

    expect(homeLink.className).toContain('contained');
    expect(cvLink.className).toContain('outlined');
  });
});
