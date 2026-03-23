import * as React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

type MockWelcomeAudioState = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ready: boolean;
  error?: string;
  audioConsent: 'unknown' | 'granted' | 'declined';
  grantAudioConsent: () => void;
  declineAudioConsent: () => void;
};

const mockWelcomeAudioContext = React.createContext<MockWelcomeAudioState | null>(null);

jest.mock('../../../src/WelcomeAudioProvider', () => {
  const React = require('react');

  return {
    useWelcomeAudio: () => {
      const value = React.useContext(mockWelcomeAudioContext);
      if (!value) {
        throw new Error('Missing mock welcome audio state.');
      }
      return value;
    },
  };
});

const {
  WelcomeOnboardingProvider,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} = require('../../../src/WelcomeOnboardingProvider');
const { useHomeWelcomeSequence } = require('../../../src/hooks/useHomeWelcomeSequence');

const renderSequence = ({
  initialAudioConsent = 'unknown',
  error,
}: {
  initialAudioConsent?: MockWelcomeAudioState['audioConsent'];
  error?: string;
} = {}) => {
  type AudioControls = {
    play: jest.Mock<Promise<void>, []>;
    pause: jest.Mock<void, []>;
    grantAudioConsent: jest.Mock<void, []>;
    declineAudioConsent: jest.Mock<void, []>;
  };

  const audioState: {
    setAudioConsent: React.Dispatch<React.SetStateAction<MockWelcomeAudioState['audioConsent']>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  } = {
    setAudioConsent: () => {},
    setIsPlaying: () => {},
  };

  const audioControls: AudioControls = {
    play: jest.fn(async () => {
      audioState.setAudioConsent('granted');
      audioState.setIsPlaying(true);
    }),
    pause: jest.fn(() => audioState.setIsPlaying(false)),
    grantAudioConsent: jest.fn(),
    declineAudioConsent: jest.fn(() => {
      audioState.setAudioConsent('declined');
    }),
  };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const [audioConsent, setAudioConsent] =
      React.useState<MockWelcomeAudioState['audioConsent']>(initialAudioConsent);
    const [isPlaying, setIsPlaying] = React.useState(initialAudioConsent === 'granted');

    audioState.setAudioConsent = setAudioConsent;
    audioState.setIsPlaying = setIsPlaying;

    return (
      <mockWelcomeAudioContext.Provider
        value={{
          play: audioControls.play,
          pause: audioControls.pause,
          isPlaying,
          ready: true,
          error,
          audioConsent,
          grantAudioConsent: audioControls.grantAudioConsent,
          declineAudioConsent: audioControls.declineAudioConsent,
        }}
      >
        <WelcomeOnboardingProvider>{children}</WelcomeOnboardingProvider>
      </mockWelcomeAudioContext.Provider>
    );
  };

  const hook = renderHook(() => useHomeWelcomeSequence(), { wrapper: Wrapper });

  return { ...hook, audioControls };
};

describe('useHomeWelcomeSequence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('opens the audio prompt for first-time visitors and keeps the hero blocked', async () => {
    const { result } = renderSequence();

    await waitFor(() => expect(result.current.isPromptOpen).toBe(true));
    expect(result.current.isCustomizeOpen).toBe(false);
    expect(result.current.isSettingsHintOpen).toBe(false);
    expect(result.current.isHeroAnimationReady).toBe(false);
  });

  it('declining the prompt closes it and advances to the customize step', async () => {
    const { result, audioControls } = renderSequence();

    await waitFor(() => expect(result.current.isPromptOpen).toBe(true));

    act(() => {
      result.current.handleOptOut();
    });

    expect(audioControls.declineAudioConsent).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.isPromptOpen).toBe(false));
    await waitFor(() => expect(result.current.isCustomizeOpen).toBe(true));
  });

  it('playing audio closes the prompt and advances to the customize step', async () => {
    const { result, audioControls } = renderSequence();

    await waitFor(() => expect(result.current.isPromptOpen).toBe(true));

    await act(async () => {
      await result.current.handlePlay();
    });

    expect(audioControls.play).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    await waitFor(() => expect(result.current.isPromptOpen).toBe(false));
    await waitFor(() => expect(result.current.isCustomizeOpen).toBe(true));
  });

  it('advances from customize to settings hint and then completes onboarding', async () => {
    const { result } = renderSequence({ initialAudioConsent: 'declined' });

    await waitFor(() => expect(result.current.isCustomizeOpen).toBe(true));

    act(() => {
      result.current.handleCustomizeDismiss();
    });

    await waitFor(() => expect(result.current.isCustomizeOpen).toBe(false));
    await waitFor(() => expect(result.current.isSettingsHintOpen).toBe(true));

    act(() => {
      result.current.handleSettingsHintComplete();
    });

    await waitFor(() => expect(result.current.isSettingsHintOpen).toBe(false));
    await waitFor(() => expect(result.current.isHeroAnimationReady).toBe(true));
    expect(window.localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)).toBe('true');
  });

  it('starts ready for returning visitors with completed onboarding', async () => {
    window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');

    const { result } = renderSequence({ initialAudioConsent: 'declined' });

    await waitFor(() => expect(result.current.isHeroAnimationReady).toBe(true));
    expect(result.current.isPromptOpen).toBe(false);
    expect(result.current.isCustomizeOpen).toBe(false);
    expect(result.current.isSettingsHintOpen).toBe(false);
  });
});
