import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../ThemeProvider';
import { HeaderActions } from './HeaderActions';

jest.mock('./HeaderAppearanceDial', () => ({
  HeaderAppearanceDial: ({
    onChangeAppearance,
  }: {
    onChangeAppearance: (appearance: 'atlas' | 'evergreen' | 'ember') => void;
  }) => (
    <button type="button" aria-label="Open appearance presets" onClick={() => onChangeAppearance('ember')}>
      Open appearance presets
    </button>
  ),
}));

const renderHeaderActions = (props: Partial<React.ComponentProps<typeof HeaderActions>> = {}) =>
  render(
    <ThemeProvider>
      <HeaderActions
        iconButtonSize="medium"
        headerIconSx={{ fontSize: 24 }}
        {...props}
      />
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

  it('renders the theme toggle when showThemeControl is true', () => {
    renderHeaderActions({ showThemeControl: true, mode: 'light' });

    expect(screen.getByRole('button', { name: 'Toggle color theme' })).toBeInTheDocument();
  });

  it('calls onToggleTheme when the theme button is clicked', () => {
    const onToggleTheme = jest.fn();
    renderHeaderActions({ showThemeControl: true, onToggleTheme });

    fireEvent.click(screen.getByRole('button', { name: 'Toggle color theme' }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders the appearance dial and forwards selections when enabled', () => {
    const onChangeAppearance = jest.fn();

    renderHeaderActions({
      showAppearanceControl: true,
      appearance: 'evergreen',
      onChangeAppearance,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open appearance presets' }));

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
  });
});
