import { act, fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '../../../src/ThemeProvider';
import {
  FIRST_VISIT_WELCOME_ID,
  FirstVisitWelcome,
} from '../../../src/components/FirstVisitWelcome';

type WelcomeProps = Partial<React.ComponentProps<typeof FirstVisitWelcome>>;

const welcomeTree = (props: WelcomeProps = {}) => (
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

const renderWelcome = (props: WelcomeProps = {}) => render(welcomeTree(props));

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

  it('keeps the audio status region mounted so a later failure is announced', () => {
    const { rerender } = renderWelcome();
    const status = screen
      .getByRole('region', { name: 'Make yourself at home' })
      .querySelector('[aria-live="polite"]');
    expect(status).toBeInTheDocument();
    expect(status).toBeEmptyDOMElement();
    rerender(welcomeTree({ audioError: 'Unable to load welcome audio.' }));
    expect(screen.getByText('Unable to load welcome audio.')).toBe(status);
    expect(screen.getByRole('button', { name: 'Play welcome audio' })).toHaveAccessibleDescription(
      'Unable to load welcome audio.'
    );
  });

  it('moves focus into the labelled panel when opened from the keyboard', () => {
    const onInteractionChange = jest.fn();
    const onClose = jest.fn();
    renderWelcome({ focusOnOpen: true, onInteractionChange, onClose });
    const region = screen.getByRole('region', { name: 'Make yourself at home' });
    expect(region).toHaveAttribute('id', FIRST_VISIT_WELCOME_ID);
    expect(region).toHaveFocus();
    expect(onInteractionChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveFocus();
  });

  it('lets its opener toggle the panel instead of treating it as a click-away', async () => {
    jest.useFakeTimers();
    try {
      const onClose = jest.fn();
      const returnFocusRef = { current: null as HTMLButtonElement | null };
      renderWelcome({ onClose, returnFocusRef });
      returnFocusRef.current = screen.getByRole('button', { name: 'Settings' });
      // ClickAwayListener ignores events until its activation tick has passed.
      act(() => jest.runOnlyPendingTimers());
      fireEvent.mouseDown(returnFocusRef.current);
      expect(onClose).not.toHaveBeenCalled();
      fireEvent.mouseDown(document.body);
      expect(onClose).toHaveBeenCalledTimes(1);
    } finally {
      jest.useRealTimers();
    }
  });
});
