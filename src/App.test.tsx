import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

describe('App', () => {
  it('renders the Header and Footer on every route', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
