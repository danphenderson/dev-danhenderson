import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { FirstVisitCustomizeModal } from '../../../src/components/FirstVisitCustomizeModal';

const renderCustomizeModal = (
  props: Partial<React.ComponentProps<typeof FirstVisitCustomizeModal>> = {}
) =>
  render(
    <ThemeProvider>
      <FirstVisitCustomizeModal
        open={true}
        onClose={jest.fn()}
        motionIntensity="default"
        onChangeMotionIntensity={jest.fn()}
        isAudioPlaying={false}
        onToggleAudio={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('FirstVisitCustomizeModal', () => {
  it('calls onToggleAudio when the audio button is clicked', () => {
    const onToggleAudio = jest.fn();
    renderCustomizeModal({ onToggleAudio });

    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));

    expect(onToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('shows loading feedback and disables the audio control while audio is starting', () => {
    renderCustomizeModal({ isAudioLoading: true });

    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeDisabled();
  });

  it('renders audio errors with the shared caption styling', () => {
    renderCustomizeModal({ audioError: 'Unable to play welcome audio.' });

    const errorText = screen.getByText('Unable to play welcome audio.');

    expect(errorText.tagName).toBe('SPAN');
    expect(errorText).toHaveClass('MuiTypography-caption');
  });
});
