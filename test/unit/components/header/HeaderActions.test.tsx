import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../../src/ThemeProvider';
import { HeaderSettingsPopover } from '../../../../src/components/header/HeaderSettingsPopover';

const mockUseReducedMotion = jest.fn().mockReturnValue(false);

jest.mock('motion/react', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

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
        effectiveMotionIntensity="default"
        isSystemMotionOverrideActive={false}
        onChangeMotionIntensity={jest.fn()}
        showAudioControl={false}
        isPlaying={false}
        onToggleAudio={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('HeaderSettingsPopover', () => {
  beforeEach(() => {
    mockUseReducedMotion.mockReset();
    mockUseReducedMotion.mockReturnValue(false);
  });

  it('renders the settings trigger button', () => {
    renderSettingsPopover();

    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
  });

  it('opens the settings popover when the trigger is clicked', () => {
    renderSettingsPopover();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByTestId('settings-popover-content')).toBeInTheDocument();
  });

  it('renders the dark mode switch inside the popover', () => {
    renderSettingsPopover({ mode: 'light' });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    const toggle = screen.getByRole('switch', { name: /dark mode/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).not.toBeChecked();
  });

  it('shows the dark mode switch as checked when mode is dark', () => {
    renderSettingsPopover({ mode: 'dark' });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByRole('switch', { name: /dark mode/i })).toBeChecked();
  });

  it('calls onToggleTheme when the dark mode switch is toggled', () => {
    const onToggleTheme = jest.fn();
    renderSettingsPopover({ onToggleTheme });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('switch', { name: /dark mode/i }));

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

  it('displays the active appearance preset label', () => {
    renderSettingsPopover({ appearance: 'ember' });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByTestId('active-appearance-label')).toHaveTextContent('Ember');
  });

  it('calls onChangeAppearance when a swatch is clicked', () => {
    const onChangeAppearance = jest.fn();
    renderSettingsPopover({ onChangeAppearance });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Ember' }));

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
  });

  it('moves focus and changes appearance with arrow-key navigation', () => {
    const onChangeAppearance = jest.fn();
    renderSettingsPopover({ onChangeAppearance });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    const currentSwatch = screen.getByRole('radio', { name: 'Evergreen (active)' });
    fireEvent.focus(currentSwatch);

    fireEvent.keyDown(currentSwatch, { key: 'ArrowRight' });

    expect(onChangeAppearance).toHaveBeenCalledTimes(1);
    expect(onChangeAppearance).toHaveBeenCalledWith('ember');
    expect(screen.getByRole('radio', { name: 'Ember' })).toHaveFocus();
  });

  it('renders icon-only motion toggles and shows tooltips on hover', async () => {
    renderSettingsPopover();

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    const expressiveButton = screen.getByRole('button', { name: 'Expressive' });

    expect(expressiveButton).toHaveTextContent('');

    fireEvent.mouseOver(expressiveButton);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Expressive');
  });

  it('shows the reduced-motion notice and disables motion controls when the OS preference is active', () => {
    const onChangeMotionIntensity = jest.fn();
    mockUseReducedMotion.mockReturnValue(true);
    renderSettingsPopover({
      onChangeMotionIntensity,
      effectiveMotionIntensity: 'off',
      isSystemMotionOverrideActive: true,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByTestId('reduced-motion-notice')).toBeInTheDocument();

    ['Off', 'Subtle', 'Default', 'Expressive'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Expressive' }));

    expect(onChangeMotionIntensity).not.toHaveBeenCalled();
  });

  it('renders audio controls when showAudioControl is true', () => {
    renderSettingsPopover({ showAudioControl: true, isPlaying: false });

    fireEvent.click(screen.getByRole('button', { name: 'Open settings' }));

    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeInTheDocument();
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

    expect(screen.queryByRole('button', { name: 'Play welcome audio' })).not.toBeInTheDocument();
  });
});
