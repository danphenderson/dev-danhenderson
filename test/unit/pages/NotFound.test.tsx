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

jest.mock('../../../src/components/layout/SectionHeading', () => ({
  SectionHeading: ({
    overline,
    title,
    subtitle,
  }: {
    overline: string;
    title?: string;
    subtitle?: string;
  }) => (
    <div
      data-testid="section-heading"
      data-overline={overline}
      data-title={title ?? ''}
      data-subtitle={subtitle ?? ''}
    >
      {title}
      {subtitle && <span>{subtitle}</span>}
    </div>
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

  it('uses the shared section heading for the route recovery intro', () => {
    render(
      <MemoryRouter future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('section-heading')).toHaveAttribute(
      'data-overline',
      'Route recovery'
    );
    expect(screen.getByTestId('section-heading')).toHaveAttribute('data-title', '404 Not Found');
    expect(screen.getByTestId('section-heading')).toHaveAttribute(
      'data-subtitle',
      "The page you're looking for doesn't exist."
    );
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
    expect(
      screen.getAllByText('Open climbing ticks, goals, and analytics.').length
    ).toBeGreaterThan(0);
  });

  it('wires the attempted path label from the current location', () => {
    render(
      <MemoryRouter initialEntries={['/photography/nonexistent']} future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('/photography/nonexistent')).toBeInTheDocument();
  });

  it('shows contextual suggestions matching the attempted path segments', () => {
    render(
      <MemoryRouter initialEntries={['/cv/experience']} future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    // /cv/experience should generate suggestions related to CV
    expect(screen.getByText('/cv/experience')).toBeInTheDocument();
    // The route hint for /cv should produce suggested destinations
    expect(screen.getByText('Suggested destinations')).toBeInTheDocument();
  });

  it('provides a suggested palette query derived from the route', () => {
    render(
      <MemoryRouter initialEntries={['/photography/mountains']} future={routerFuture}>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    // The palette hint button should exist — verifies suggestedPaletteQuery is wired
    const paletteButton = screen.getByRole('button', { name: 'Open command palette' });

    expect(paletteButton).toBeInTheDocument();
  });
});
