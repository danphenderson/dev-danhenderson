import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LEGACY_AUDIO_PROMPT_STORAGE_KEY, PREFERENCE_STORAGE_KEYS } from './theme/preferences';
import { resolvePublicAssetPath } from './utils/assets';

export type { AudioConsent } from './types/ui';

type WelcomeAudioContextValue = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  error?: string;
};

const WelcomeAudioContext = createContext<WelcomeAudioContextValue>({
  play: async () => {},
  pause: () => {},
  isPlaying: false,
});

const AUDIO_START_TIMEOUT_MS = 8000;
const PLAYBACK_ERROR_MESSAGE = 'Audio could not start. Please try again.';

const createAbortError = () => new DOMException('Audio playback cancelled.', 'AbortError');

const waitForPlayback = (playback: Promise<void>, signal: AbortSignal): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error(PLAYBACK_ERROR_MESSAGE));
    }, AUDIO_START_TIMEOUT_MS);
    const abort = () => {
      cleanup();
      reject(createAbortError());
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    };
    signal.addEventListener('abort', abort, { once: true });
    playback.then(
      () => {
        cleanup();
        resolve();
      },
      (error) => {
        cleanup();
        reject(error);
      }
    );
    if (signal.aborted) abort();
  });

const persistExplicitPlay = () => {
  try {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.audioConsent, 'granted');
    window.localStorage.removeItem(LEGACY_AUDIO_PROMPT_STORAGE_KEY);
  } catch {
    // Playback remains usable when storage is unavailable.
  }
};

export const WelcomeAudioProvider = ({ children }: PropsWithChildren) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef<Promise<void> | null>(null);
  const playControllerRef = useRef<AbortController | null>(null);
  const playbackRequestedRef = useRef(false);
  const unmountedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    unmountedRef.current = false;
    const audio = audioRef.current;
    return () => {
      unmountedRef.current = true;
      playbackRequestedRef.current = false;
      playControllerRef.current?.abort();
      playControllerRef.current = null;
      pendingPlayRef.current = null;
      audio?.pause();
      audio?.removeAttribute('src');
      audio?.load();
    };
  }, []);

  const pause = useCallback(() => {
    playbackRequestedRef.current = false;
    playControllerRef.current?.abort();
    playControllerRef.current = null;
    pendingPlayRef.current = null;
    audioRef.current?.pause();
    if (!unmountedRef.current) setIsPlaying(false);
  }, []);

  const play = useCallback((): Promise<void> => {
    if (pendingPlayRef.current) return pendingPlayRef.current;
    const audio = audioRef.current;
    if (!audio || unmountedRef.current) return Promise.reject(createAbortError());

    const controller = new AbortController();
    playControllerRef.current = controller;
    playbackRequestedRef.current = true;
    setError(undefined);
    persistExplicitPlay();

    // Assign the source and call play synchronously inside the user's gesture.
    // Stored consent never starts a request or playback on mount.
    if (!audio.getAttribute('src')) {
      audio.src = resolvePublicAssetPath('/assets/verse.mp3');
    } else if (audio.error) {
      audio.load();
    }

    let playback: Promise<void>;
    try {
      playback = audio.play();
    } catch (cause) {
      playback = Promise.reject(cause);
    }
    const pending = waitForPlayback(playback, controller.signal)
      .then(() => {
        if (!controller.signal.aborted && !unmountedRef.current) {
          setIsPlaying(!audio.paused);
        }
      })
      .catch((cause: unknown) => {
        if (playControllerRef.current === controller) {
          playbackRequestedRef.current = false;
          audio.pause();
          if (!unmountedRef.current) {
            setIsPlaying(false);
            if (!(cause instanceof Error && cause.name === 'AbortError')) {
              setError(PLAYBACK_ERROR_MESSAGE);
            }
          }
        }
        throw cause;
      })
      .finally(() => {
        if (playControllerRef.current === controller) {
          playControllerRef.current = null;
          pendingPlayRef.current = null;
        }
      });
    pendingPlayRef.current = pending;
    return pending;
  }, []);

  return (
    <WelcomeAudioContext.Provider value={{ play, pause, isPlaying, error }}>
      {children}
      <audio
        ref={audioRef}
        data-testid="welcome-audio"
        preload="none"
        loop
        hidden
        aria-hidden="true"
        onPlaying={() => {
          if (unmountedRef.current) return;
          if (!playbackRequestedRef.current) {
            audioRef.current?.pause();
            return;
          }
          setError(undefined);
          setIsPlaying(true);
        }}
        onPause={() => {
          if (!unmountedRef.current) setIsPlaying(false);
        }}
        onError={() => {
          if (unmountedRef.current) return;
          pause();
          setError(PLAYBACK_ERROR_MESSAGE);
        }}
      />
    </WelcomeAudioContext.Provider>
  );
};

export const useWelcomeAudio = () => useContext(WelcomeAudioContext);
