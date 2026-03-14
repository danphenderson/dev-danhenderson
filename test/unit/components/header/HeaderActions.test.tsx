import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import type { AppAppearanceKey } from '../../../../src/theme/appAppearance';
import { HeaderActions } from '../../../../src/components/header/HeaderActions';

jest.mock('../../../../src/components/header/HeaderAppearanceDial', () => ({
  HeaderAppearanceDial: ({
    onChangeAppearance,
    onToggleTheme,
    mode,
  }: {
    onChangeAppearance?: (appearance: AppAppearanceKey) => void;
    onToggleTheme?: () => void;
    mode?: 'light' | 'dark';
  }) => (
    <div data-testid="header-appearance-dial">
      <button type="button" aria-label="Open appearance presets">
        Open appearance presets
      </button>
      {onToggleTheme ? (
        <button
          type="button"
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
          onClick={() => onToggleTheme()}
        >
          Toggle theme
        </button>
      ) : null}
      {onChangeAppearance ? (
        <button
          type="button"
          aria-label="Use Ember appearance"
          onClick={() => onChangeAppearance('ember')}
        >
          Use Ember appearance
        </button>
      ) : null}
    </div>
  ),
}));

const createAppearanceDial = (
  overrides: Partial<NonNullable<React.ComponentProps<typeof HeaderActions>['appearanceDial']>> = {}
) => ({
  appearance: 'evergreen' as const,
  mode: 'light' as const,
  onChangeAppearance: jest.fn(),
  onToggleTheme: jest.fn(),
  ...overrides,
});

const renderHeaderActions = (props: Partial<React.ComponentProps<typeof HeaderActions>> = {}) =>
  render(
    <ThemeProvider>
      <HeaderActions iconButtonSize="medium" headerIconSx={{ fontSize: 24 }} {...props} />
    </ThemeProvider>
  );

describe('HeaderActions', () => {
  it('renders the play button when showAudioControl is true and not playing', () => {
    renderHeaderActions({ showAudioControl: true, isPlaying: false });

    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeInTheDocument();
  });

  it('renders the pause button when playing', () => {
    renderHeaderActions({ showAudioControl: true, isPlaying: true });

    expect(screen.getByRole('button', { name: 'Pause welcome audio' })).toBeInTheDocument();
  });

  it('calls onToggleAudio when the audio button is clicked', () => {
    const onToggleAudio = jest.fn();
    renderHeaderActions({ showAudioControl: true, onToggleAudio });

    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));

    expect(onToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('renders the appearance dial when theme controls are enabled', () => {
    renderHeaderActions({ appearanceDial: createAppearanceDial() });

    expect(screen.getByTestId('header-appearance-dial')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument();
  });

  it('calls onToggleTheme when the theme action is clicked', () => {
    const onToggleTheme = jest.fn();
    renderHeaderActions({ appearanceDial: createAppearanceDial({ onToggleTheme }) });

    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders the appearance dial and forwards selections when enabled', () => {
    const onChangeAppearance = jest.fn();

    renderHeaderActions({
      appearanceDial: createAppearanceDial({ onChangeAppearance }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Use Ember appearance' }));

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
  });
});
