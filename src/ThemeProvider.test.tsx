import { render, screen, act } from '@testing-library/react';
import ThemeProvider, { useAppTheme } from './ThemeProvider';

const ThemeConsumer = () => {
  const { mode, toggleTheme } = useAppTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides light mode by default', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('toggleTheme switches mode to dark', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'toggle' }).click();
    });

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(window.localStorage.getItem('danhenderson-theme')).toBe('dark');
  });

  it('reads stored theme from localStorage', () => {
    window.localStorage.setItem('danhenderson-theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('returns null when no children are provided', () => {
    const { container } = render(<ThemeProvider />);
    expect(container.innerHTML).toBe('');
  });
});
