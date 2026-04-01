import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  LEGACY_AUDIO_PROMPT_STORAGE_KEY,
  PREFERENCE_STORAGE_KEYS,
  isAudioConsent,
} from './theme/preferences';
import type { AudioConsent } from './types/ui';
import { shouldResetWelcomeSequenceOnHomeLoad } from './welcomeSequenceEnvironment';

export type { AudioConsent } from './types/ui';

type SoundCloudWidget = {
  play: () => void;
  pause: () => void;
  bind: (event: string, listener: () => void) => void;
  unbind: (event?: string, listener?: () => void) => void;
  isPaused: (callback: (paused: boolean) => void) => void;
  setLoop: (loop: boolean) => void;
};

type WelcomeAudioContextValue = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ready: boolean;
  error?: string;
  audioConsent: AudioConsent;
  grantAudioConsent: () => void;
  declineAudioConsent: () => void;
};

const WelcomeAudioContext = createContext<WelcomeAudioContextValue>({
  play: async () => {},
  pause: () => {},
  isPlaying: false,
  ready: false,
  error: undefined,
  audioConsent: 'unknown',
  grantAudioConsent: () => {},
  declineAudioConsent: () => {},
});

const WIDGET_SCRIPT_SRC = 'https://w.soundcloud.com/player/api.js';
const TRACK_EMBED_URL =
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A298021432&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
const WIDGET_BOOT_TIMEOUT_MS = 8000;
const hiddenAudioIframeStyle = {
  position: 'absolute',
  width: 0,
  height: 0,
  border: 0,
  clipPath: 'inset(50%)',
  clip: 'rect(0 0 0 0)',
  overflow: 'hidden',
} as const;

let widgetScriptPromise: Promise<void> | null = null;

type SoundCloudNamespace = {
  Widget: (iframe: HTMLIFrameElement) => SoundCloudWidget;
};

declare global {
  interface Window {
    SC?: SoundCloudNamespace;
  }
}

const createAbortError = () => {
  const error = new Error('Welcome audio setup aborted.');
  error.name = 'AbortError';
  return error;
};

const withTimeout = <T,>(
  promise: Promise<T>,
  message: string,
  timeoutMs: number,
  signal?: AbortSignal
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      cleanup();
      reject(new Error(message));
    }, timeoutMs);

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    const cleanup = () => {
      window.clearTimeout(timerId);
      signal?.removeEventListener('abort', handleAbort);
    };

    signal?.addEventListener('abort', handleAbort, { once: true });

    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error);
      }
    );
  });

const getStoredAudioConsent = (): AudioConsent => {
  if (typeof window === 'undefined') return 'unknown';

  try {
    const storedConsent = window.localStorage.getItem(PREFERENCE_STORAGE_KEYS.audioConsent);
    if (isAudioConsent(storedConsent) && storedConsent !== 'unknown') {
      return storedConsent;
    }

    if (window.localStorage.getItem(LEGACY_AUDIO_PROMPT_STORAGE_KEY) === 'dismissed') {
      return 'declined';
    }
  } catch {
    // localStorage may be unavailable in restricted browsing contexts
  }

  return 'unknown';
};

const getInitialAudioConsent = (): AudioConsent =>
  shouldResetWelcomeSequenceOnHomeLoad() ? 'unknown' : getStoredAudioConsent();

const persistAudioConsent = (consent: Exclude<AudioConsent, 'unknown'>) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(PREFERENCE_STORAGE_KEYS.audioConsent, consent);
    window.localStorage.removeItem(LEGACY_AUDIO_PROMPT_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable in restricted browsing contexts
  }
};

const loadWidgetScript = (signal: AbortSignal): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available.'));
  }

  if (window.SC?.Widget) {
    return Promise.resolve();
  }

  if (widgetScriptPromise) {
    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise<void>((resolve, reject) => {
    const resolveWhenReady = () => {
      if (window.SC?.Widget) {
        resolve();
        return;
      }

      widgetScriptPromise = null;
      reject(new Error('SoundCloud widget API unavailable.'));
    };

    const rejectLoad = () => {
      widgetScriptPromise = null;
      reject(new Error('Failed to load SoundCloud widget.'));
    };
    const handleAbort = () => {
      widgetScriptPromise = null;
      reject(createAbortError());
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT_SRC}"]`
    );
    if (existingScript) {
      if (window.SC?.Widget) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', resolveWhenReady, { once: true });
      existingScript.addEventListener('error', rejectLoad, { once: true });
      signal.addEventListener('abort', handleAbort, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = resolveWhenReady;
    script.onerror = rejectLoad;
    signal.addEventListener('abort', handleAbort, { once: true });
    document.body.appendChild(script);
  });

  return widgetScriptPromise;
};

export const WelcomeAudioProvider = ({ children }: PropsWithChildren<{}>) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeWaitersRef = useRef<Array<(iframe: HTMLIFrameElement) => void>>([]);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const setupPromiseRef = useRef<Promise<SoundCloudWidget> | null>(null);
  const setupAbortControllerRef = useRef<AbortController | null>(null);
  const unmountedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [audioConsent, setAudioConsent] = useState<AudioConsent>(getInitialAudioConsent);

  const bindIframeRef = useCallback((node: HTMLIFrameElement | null) => {
    iframeRef.current = node;

    if (!node) {
      return;
    }

    const waiters = iframeWaitersRef.current.splice(0);
    waiters.forEach((resolve) => resolve(node));
  }, []);

  const waitForIframe = useCallback((signal: AbortSignal) => {
    if (iframeRef.current) {
      return Promise.resolve(iframeRef.current);
    }

    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Window is not available.'));
    }

    const iframeMountPromise = new Promise<HTMLIFrameElement>((resolve, reject) => {
      const handleAbort = () => {
        iframeWaitersRef.current = iframeWaitersRef.current.filter((waiter) => waiter !== resolve);
        signal.removeEventListener('abort', handleAbort);
        reject(createAbortError());
      };

      iframeWaitersRef.current.push(resolve);
      signal.addEventListener('abort', handleAbort, { once: true });
    });

    return withTimeout(
      iframeMountPromise,
      'Audio iframe did not mount in time.',
      WIDGET_BOOT_TIMEOUT_MS,
      signal
    );
  }, []);

  useEffect(() => {
    unmountedRef.current = false;

    return () => {
      unmountedRef.current = true;
      setupAbortControllerRef.current?.abort();
      setupAbortControllerRef.current = null;
      if (widgetRef.current) {
        widgetRef.current.unbind('ready');
        widgetRef.current.unbind('play');
        widgetRef.current.unbind('pause');
        widgetRef.current.unbind('finish');
      }
    };
  }, []);

  useEffect(() => {
    if (audioConsent === 'granted') return;

    setupAbortControllerRef.current?.abort();
    setupAbortControllerRef.current = null;
    if (widgetRef.current) {
      widgetRef.current.pause();
      widgetRef.current.unbind('ready');
      widgetRef.current.unbind('play');
      widgetRef.current.unbind('pause');
      widgetRef.current.unbind('finish');
      widgetRef.current = null;
    }

    setupPromiseRef.current = null;
    iframeWaitersRef.current = [];
    setIsPlaying(false);
    setReady(false);
  }, [audioConsent]);

  const grantAudioConsent = useCallback(() => {
    setAudioConsent((previousConsent) => {
      if (previousConsent !== 'granted') {
        persistAudioConsent('granted');
      }
      return 'granted';
    });
  }, []);

  const declineAudioConsent = useCallback(() => {
    persistAudioConsent('declined');
    setAudioConsent('declined');
  }, []);

  const initializeWidget = useCallback(async (): Promise<SoundCloudWidget> => {
    if (setupPromiseRef.current) {
      return setupPromiseRef.current;
    }

    if (widgetRef.current && ready) {
      return widgetRef.current;
    }

    setupPromiseRef.current = (async () => {
      const controller = new AbortController();
      setupAbortControllerRef.current = controller;

      await withTimeout(
        loadWidgetScript(controller.signal),
        'Timed out loading welcome audio widget script.',
        WIDGET_BOOT_TIMEOUT_MS,
        controller.signal
      );
      const iframe = await waitForIframe(controller.signal);
      const SC = window.SC;

      if (!SC?.Widget) {
        throw new Error('SoundCloud widget API unavailable.');
      }

      const widget: SoundCloudWidget = SC.Widget(iframe);
      widgetRef.current = widget;

      await new Promise<void>((resolve, reject) => {
        let widgetReady = false;

        const markReady = () => {
          if (unmountedRef.current) return;

          widgetReady = true;
          window.clearTimeout(timeoutId);
          controller.signal.removeEventListener('abort', handleAbort);
          widget.unbind('ready', markReady);
          setReady(true);
          widget.isPaused((paused: boolean) => {
            if (!unmountedRef.current) {
              setIsPlaying(!paused);
            }
          });
          resolve();
        };

        const handlePlay = () => {
          if (!unmountedRef.current) {
            setIsPlaying(true);
          }
        };

        const handlePause = () => {
          if (!unmountedRef.current) {
            setIsPlaying(false);
          }
        };

        const handleFinish = () => {
          if (unmountedRef.current) return;

          widget.play();
          setIsPlaying(true);
        };

        const handleAbort = () => {
          cleanup();
          reject(createAbortError());
        };

        const timeoutId = window.setTimeout(() => {
          cleanup();
          reject(new Error('Timed out waiting for the welcome audio widget to become ready.'));
        }, WIDGET_BOOT_TIMEOUT_MS);

        const cleanup = () => {
          window.clearTimeout(timeoutId);
          controller.signal.removeEventListener('abort', handleAbort);
          widget.unbind('ready', markReady);
          if (!widgetReady) {
            widget.unbind('play', handlePlay);
            widget.unbind('pause', handlePause);
            widget.unbind('finish', handleFinish);
          }
        };

        widget.bind('ready', markReady);
        widget.bind('play', handlePlay);
        widget.bind('pause', handlePause);
        widget.bind('finish', handleFinish);
        controller.signal.addEventListener('abort', handleAbort, { once: true });
      });

      return widget;
    })()
      .catch((err) => {
        setupPromiseRef.current = null;
        widgetRef.current = null;
        setupAbortControllerRef.current = null;

        if (!unmountedRef.current) {
          setReady(false);
        }

        throw err;
      })
      .finally(() => {
        setupAbortControllerRef.current = null;
      });

    return setupPromiseRef.current;
  }, [ready, waitForIframe]);

  useEffect(() => {
    if (audioConsent !== 'granted') return;

    initializeWidget().catch((err) => {
      if ((err as Error).name === 'AbortError') {
        return;
      }
      if (!unmountedRef.current) {
        setError('Unable to load welcome audio.');
      }
      console.error('Welcome audio initialization failed:', err);
    });
  }, [audioConsent, initializeWidget]);

  const play = useCallback(async () => {
    try {
      setError(undefined);

      if (audioConsent !== 'granted') {
        grantAudioConsent();
      }

      const widget = await initializeWidget();
      widget.play();
    } catch (err) {
      if (!unmountedRef.current) {
        setError('Unable to play welcome audio.');
      }
      throw err;
    }
  }, [audioConsent, grantAudioConsent, initializeWidget]);

  const pause = useCallback(() => {
    if (!widgetRef.current) return;
    widgetRef.current.pause();
  }, []);

  return (
    <>
      <WelcomeAudioContext.Provider
        value={{
          play,
          pause,
          isPlaying,
          ready,
          error,
          audioConsent,
          grantAudioConsent,
          declineAudioConsent,
        }}
      >
        {children}
      </WelcomeAudioContext.Provider>
      {audioConsent === 'granted' && (
        <iframe
          ref={bindIframeRef}
          title="Welcome audio"
          src={TRACK_EMBED_URL}
          allow="autoplay"
          style={hiddenAudioIframeStyle}
          aria-hidden={true}
        />
      )}
    </>
  );
};

export const useWelcomeAudio = () => useContext(WelcomeAudioContext);
