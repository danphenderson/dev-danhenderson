import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HeaderSettingsPopover } from '../../../../src/components/header/HeaderSettingsPopover';

const renderSettingsPopover = (
  props: Partial<React.ComponentProps<typeof HeaderSettingsPopover>> = {}
) =>
  render(
    <ThemeProvider>
      <HeaderSettingsPopover
        mode="light"
        onToggleTheme={jest.fn()}
        appearance="evergreen"
        onChangeAppearance={jest.fn()}
        motionIntensity="default"
        onChangeMotionIntensity={jest.fn()}
        showAudioControl={false}
        isPlaying={false}
        onToggleAudio={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('HeaderSettingsPopover', () => {
  it('renders the settings trigger button', () => {
    renderSettingsPopover();

    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
  });

  it('opens the settings popover when the trigger is clicked', () => {
    renderSettingsPopover();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByTestId('settings-popover-content')).toBeInTheDocument();
  });

  it('renders the theme toggle inside the popover', () => {
    renderSettingsPopover({ mode: 'light' });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(
      screen.getByRole('button', { name: 'Switch to dark mode' })
    ).toBeInTheDocument();
  });

  it('calls onToggleTheme when the theme action is clicked', () => {
    const onToggleTheme = jest.fn();
    renderSettingsPopover({ onToggleTheme });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders appearance swatches inside the popover', () => {
    renderSettingsPopover();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByRole('radio', { name: 'Evergreen (active)' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Atlas' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ember' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Solstice' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Drift' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Graphite' })).toBeInTheDocument();
  });

  it('calls onChangeAppearance when a swatch is clicked', () => {
    const onChangeAppearance = jest.fn();
    renderSettingsPopover({ onChangeAppearance });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Ember' }));

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
  });

  it('renders audio controls when showAudioControl is true', () => {
    renderSettingsPopover({ showAudioControl: true, isPlaying: false });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(
      screen.getByRole('button', { name: 'Play welcome audio' })
    ).toBeInTheDocument();
  });

  it('calls onToggleAudio when the audio button is clicked', () => {
    const onToggleAudio = jest.fn();
    renderSettingsPopover({ showAudioControl: true, onToggleAudio });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));

    expect(onToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('does not render audio controls when showAudioControl is false', () => {
    renderSettingsPopover({ showAudioControl: false });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(
      screen.queryByRole('button', { name: 'Play welcome audio' })
    ).not.toBeInTheDocument();
  });
});
