import { render, screen, act } from '@testing-library/react';
import ThemeProvider, { useAppTheme } from '../../src/ThemeProvider';
import { APP_APPEARANCE_STORAGE_KEY, defaultAppAppearanceKey } from '../../src/theme/appAppearance';

const legacyCvAppearanceStorageKey = 'danhenderson-cv-appearance';

const ThemeConsumer = () => {
  const { mode, appearance, setAppearance, toggleTheme } = useAppTheme();

  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="appearance">{appearance}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setAppearance('atlas')}>set-atlas</button>
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

  it('provides dark evergreen defaults when no stored preference exists', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('appearance')).toHaveTextContent(defaultAppAppearanceKey);
    expect(window.matchMedia).not.toHaveBeenCalled();
  });

  it('toggleTheme switches mode to light and persists it', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'toggle' }).click();
    });

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(window.localStorage.getItem('danhenderson-theme')).toBe('light');
  });

  it('setAppearance updates the global appearance and persists it', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'set-atlas' }).click();
    });

    expect(screen.getByTestId('appearance')).toHaveTextContent('atlas');
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe('atlas');
  });

  it('reads stored theme from localStorage', () => {
    window.localStorage.setItem('danhenderson-theme', 'dark');
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, 'ember');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('appearance')).toHaveTextContent('ember');
  });

  it('defaults to evergreen when only the legacy CV appearance storage key exists', () => {
    window.localStorage.setItem(legacyCvAppearanceStorageKey, 'atlas');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('appearance')).toHaveTextContent(defaultAppAppearanceKey);
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe(defaultAppAppearanceKey);
  });

  it('returns null when no children are provided', () => {
    const { container } = render(<ThemeProvider />);
    expect(container.innerHTML).toBe('');
  });
});
