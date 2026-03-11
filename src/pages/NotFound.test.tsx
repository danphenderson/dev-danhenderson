import { render, screen } from '@testing-library/react';
import ThemeProvider from '../ThemeProvider';
import NotFound from './NotFound';

jest.mock('../components/BackgroundPaper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="background-paper">{children}</div>,
}));

describe('NotFound', () => {
  it('renders 404 Not Found message', () => {
    render(
      <ThemeProvider>
        <NotFound />
      </ThemeProvider>
    );

    expect(screen.getByText('404 Not Found')).toBeInTheDocument();
  });
});
