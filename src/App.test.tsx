import { render, screen } from '@testing-library/react';
import ThemeProvider from './ThemeProvider';
import App from './App';

jest.mock('./pages/Home', () => ({
  __esModule: true,
  default: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock('./pages/CV', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-page">CV Page</div>,
}));

jest.mock('./pages/Climbing', () => ({
  __esModule: true,
  default: () => <div data-testid="climbing-page">Climbing Page</div>,
}));

jest.mock('./pages/Photography', () => ({
  __esModule: true,
  default: () => <div data-testid="photography-page">Photography Page</div>,
}));

jest.mock('./pages/PhotographyCategory', () => ({
  __esModule: true,
  default: () => <div data-testid="photography-category-page">Photography Category Page</div>,
}));

jest.mock('./pages/NotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

jest.mock('./components/Header', () => ({
  __esModule: true,
  default: () => <nav data-testid="header">Header</nav>,
}));

jest.mock('./components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('./components/CommonLinkTooltip', () => ({
  CommonLinkTooltip: () => <div data-testid="common-link-tooltip" />,
}));

describe('App', () => {
  it('renders the Header, Footer, and CommonLinkTooltip on every route', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('common-link-tooltip')).toBeInTheDocument();
  });

  it('renders the Home page by default', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
