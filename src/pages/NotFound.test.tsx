import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThemeProvider from '../ThemeProvider';
import NotFound from './NotFound';

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="background-paper">{children}</div>,
}));

describe('NotFound', () => {
  it('renders 404 Not Found message', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <NotFound />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv');
    expect(screen.getByRole('link', { name: 'Photography' })).toHaveAttribute('href', '/photography');
  });
});
