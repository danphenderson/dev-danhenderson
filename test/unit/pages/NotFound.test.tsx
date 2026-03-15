import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { routerFuture } from '../../../src/routerFuture';
import ThemeProvider from '../../../src/ThemeProvider';
import NotFound from '../../../src/pages/NotFound';

jest.mock('../../../src/components/BackgroundPaper', () => ({
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

    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'Open CV' })[0]).toHaveAttribute('href', '/cv');
    expect(screen.getAllByRole('link', { name: 'Open Climbing' })[0]).toHaveAttribute(
      'href',
      '/climbing'
    );
    expect(screen.getAllByRole('link', { name: 'Open Photography' })[0]).toHaveAttribute(
      'href',
      '/photography'
    );
  });

  it('renders the Home link as a primary action distinct from other navigation links', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link', { name: 'Go home' });
    const cvLink = screen.getAllByRole('link', { name: 'Open CV' })[0];
    const photographyLink = screen.getAllByRole('link', { name: 'Open Photography' })[0];

    expect(homeLink).toHaveClass('MuiButton-contained');
    expect(cvLink).toHaveClass('MuiButton-outlined');
    expect(photographyLink).toHaveClass('MuiButton-outlined');
  });

  it('renders shared recovery descriptions and the command palette hint', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Shared recovery routes')).toBeInTheDocument();
    expect(screen.getAllByText('Return to the home hero route.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Open climbing ticks, goals, and analytics.').length).toBeGreaterThan(0);
  });
});
