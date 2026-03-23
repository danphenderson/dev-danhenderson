import { useTheme } from '@mui/material/styles';
import { render, screen, act } from '@testing-library/react';
import ThemeProvider, { useAppTheme } from '../../src/ThemeProvider';
import { APP_APPEARANCE_STORAGE_KEY, defaultAppAppearanceKey } from '../../src/theme/appAppearance';
import { PREFERENCE_STORAGE_KEYS } from '../../src/theme/preferences';

const mockUseReducedMotion = jest.fn().mockReturnValue(false);

jest.mock('motion/react', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

const legacyCvAppearanceStorageKey = 'danhenderson-cv-appearance';

const ThemeConsumer = () => {
  const {
    mode,
    appearance,
    motionIntensity,
    effectiveMotionIntensity,
    isSystemMotionOverrideActive,
    setAppearance,
    toggleTheme,
  } = useAppTheme();
  const theme = useTheme();

  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="appearance">{appearance}</span>
      <span data-testid="motion-intensity">{motionIntensity}</span>
      <span data-testid="effective-motion-intensity">{effectiveMotionIntensity}</span>
      <span data-testid="system-motion-override">{String(isSystemMotionOverrideActive)}</span>
      <span data-testid="theme-css-animations">
        {theme.appearanceTreatment.motionScale.cssAnimations ? 'enabled' : 'disabled'}
      </span>
      <span data-testid="theme-pill-pulse">
        {theme.appearanceTreatment.motion.pillPulseEnabled ? 'enabled' : 'disabled'}
      </span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setAppearance('atlas')}>set-atlas</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockUseReducedMotion.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
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

  it('defaults to evergreen when the stored appearance matches an inherited object property', () => {
    window.localStorage.setItem(APP_APPEARANCE_STORAGE_KEY, 'toString');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('appearance')).toHaveTextContent(defaultAppAppearanceKey);
    expect(window.localStorage.getItem(APP_APPEARANCE_STORAGE_KEY)).toBe(defaultAppAppearanceKey);
  });

  it('disables theme CSS motion when reduced motion is enabled without overwriting the stored preference', () => {
    mockUseReducedMotion.mockReturnValue(true);
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'expressive');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('motion-intensity')).toHaveTextContent('expressive');
    expect(screen.getByTestId('effective-motion-intensity')).toHaveTextContent('off');
    expect(screen.getByTestId('system-motion-override')).toHaveTextContent('true');
    expect(screen.getByTestId('theme-css-animations')).toHaveTextContent('disabled');
    expect(screen.getByTestId('theme-pill-pulse')).toHaveTextContent('disabled');
    expect(window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.motionIntensity)).toBe('expressive');
  });

  it('exposes effectiveMotionIntensity matching motionIntensity when reduced motion is inactive', () => {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.motionIntensity, 'subtle');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('motion-intensity')).toHaveTextContent('subtle');
    expect(screen.getByTestId('effective-motion-intensity')).toHaveTextContent('subtle');
    expect(screen.getByTestId('system-motion-override')).toHaveTextContent('false');
  });

  it('returns null when no children are provided', () => {
    const { container } = render(<ThemeProvider />);
    expect(container.innerHTML).toBe('');
  });
});
