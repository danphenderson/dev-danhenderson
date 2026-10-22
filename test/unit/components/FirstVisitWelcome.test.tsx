import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import { FirstVisitWelcome } from '../../../src/components/FirstVisitWelcome';

const renderWelcome = (props: Partial<React.ComponentProps<typeof FirstVisitWelcome>> = {}) =>
  render(
    <ThemeProvider>
      <button id="header-settings-trigger">Settings</button>
      <FirstVisitWelcome
        open
        onClose={jest.fn()}
        onInteractionChange={jest.fn()}
        motionIntensity="default"
        onChangeMotionIntensity={jest.fn()}
        isAudioPlaying={false}
        isAudioLoading={false}
        onToggleAudio={jest.fn()}
        {...props}
      />
    </ThemeProvider>
  );

describe('FirstVisitWelcome', () => {
  it('combines preferences in a nonmodal region without stealing focus', () => {
    renderWelcome();
    expect(screen.getByRole('region', { name: 'Make yourself at home' })).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).not.toHaveAttribute('aria-hidden');
    expect(document.activeElement).toBe(document.body);
  });

  it('changes motion and only requests audio on explicit interaction', () => {
    const onToggleAudio = jest.fn();
    const onChangeMotionIntensity = jest.fn();
    renderWelcome({ onToggleAudio, onChangeMotionIntensity });
    expect(onToggleAudio).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Off' }));
    expect(onChangeMotionIntensity).toHaveBeenCalledWith('off');
    fireEvent.click(screen.getByRole('button', { name: 'Play welcome audio' }));
    expect(onToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('pauses dismissal while focus moves between controls and returns focus on Escape', () => {
    const onInteractionChange = jest.fn();
    const onClose = jest.fn();
    renderWelcome({ onInteractionChange, onClose });
    act(() => screen.getByRole('button', { name: 'Off' }).focus());
    expect(onInteractionChange).toHaveBeenLastCalledWith(true);
    act(() => screen.getByRole('button', { name: 'Play welcome audio' }).focus());
    expect(onInteractionChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveFocus();
  });

  it('pauses on hover and resumes when the pointer leaves', () => {
    const onInteractionChange = jest.fn();
    renderWelcome({ onInteractionChange });
    fireEvent.mouseEnter(screen.getByRole('region'));
    expect(onInteractionChange).toHaveBeenLastCalledWith(true);
    fireEvent.mouseLeave(screen.getByRole('region'));
    expect(onInteractionChange).toHaveBeenLastCalledWith(false);
  });

  it.each(['Dismiss welcome', 'Explore now'])(
    'allows dismissal with %s during audio loading',
    (name) => {
      const onClose = jest.fn();
      renderWelcome({ isAudioLoading: true, onClose });
      expect(screen.getByRole('button', { name: 'Play welcome audio' })).toBeDisabled();
      fireEvent.click(screen.getByRole('button', { name }));
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  );

  it('announces an audio failure and keeps entry available', () => {
    renderWelcome({ audioError: 'Unable to play welcome audio.' });
    expect(screen.getByText('Unable to play welcome audio.')).toHaveAttribute(
      'aria-live',
      'polite'
    );
    expect(screen.getByRole('button', { name: 'Explore now' })).toBeEnabled();
  });
});
