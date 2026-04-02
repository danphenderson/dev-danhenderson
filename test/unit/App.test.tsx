import { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import ThemeProvider from '../../src/ThemeProvider';
import App from '../../src/App';

jest.mock('../../src/pages/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock('../../src/pages/CV', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-page">CV Page</div>,
}));

jest.mock('../../src/pages/Climbing', () => ({
  __esModule: true,
  default: () => <div data-testid="climbing-page">Climbing Page</div>,
}));

jest.mock('../../src/pages/Photography', () => ({
  __esModule: true,
  default: () => <div data-testid="photography-page">Photography Page</div>,
}));

jest.mock('../../src/pages/PhotographyCategory', () => ({
  __esModule: true,
  default: () => <div data-testid="photography-category-page">Photography Category Page</div>,
}));

jest.mock('../../src/pages/Blog', () => ({
  __esModule: true,
  default: () => <div data-testid="blog-page">Blog Page</div>,
}));

jest.mock('../../src/pages/BlogPost', () => ({
  __esModule: true,
  default: () => <div data-testid="blog-post-page">Blog Post Page</div>,
}));

jest.mock('../../src/pages/NotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

jest.mock('../../src/components/Header', () => ({
  __esModule: true,
  default: () => <nav data-testid="header">Header</nav>,
}));

jest.mock('../../src/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('../../src/components/CommonLinkTooltip', () => ({
  CommonLinkTooltip: () => <div data-testid="common-link-tooltip" />,
}));

let mockPageTransitionChildren: ReactNode = null;
let mockPageTransitionPathname: string | undefined;

jest.mock('../../src/components/PageTransition', () => ({
  PageTransition: ({ children, pathname }: { children: ReactNode; pathname?: string }) => {
    mockPageTransitionChildren = children;
    mockPageTransitionPathname = pathname;

    return <div data-testid="page-transition">{children}</div>;
  },
}));

describe('App', () => {
  beforeEach(() => {
    mockPageTransitionChildren = null;
    mockPageTransitionPathname = undefined;
    window.history.pushState({}, '', '/');
  });

  it('renders the Header, Footer, and CommonLinkTooltip on every route', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('common-link-tooltip')).toBeInTheDocument();
    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  it('renders the Home page by default', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
  });

  it('shows the route loading fallback before an uncached lazy page is ready', async () => {
    window.history.pushState({}, '', '/photography');

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByRole('status', { name: 'Loading route content' })).toBeInTheDocument();
    expect(screen.queryByTestId('page-transition')).not.toBeInTheDocument();

    expect(await screen.findByTestId('photography-page')).toBeInTheDocument();
    expect(screen.getByTestId('page-transition')).toBeInTheDocument();
  });

  it('passes the displayed route location directly into PageTransition and Routes', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    expect(isValidElement(mockPageTransitionChildren)).toBe(true);
    expect(mockPageTransitionPathname).toBe('/');

    const routesElement = mockPageTransitionChildren as ReactElement<{
      location?: { pathname?: string };
    }>;

    expect(routesElement.props.location).toEqual(expect.objectContaining({ pathname: '/' }));
  });

  it('renders the Blog page for /blog', async () => {
    window.history.pushState({}, '', '/blog');

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(await screen.findByTestId('blog-page')).toBeInTheDocument();
    expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument();
  });

  it('suppresses app chrome for /cv?mode=story while keeping shared overlays mounted', async () => {
    window.history.pushState({}, '', '/cv?mode=story');

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(await screen.findByTestId('cv-page')).toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('common-link-tooltip')).toBeInTheDocument();
  });
});
