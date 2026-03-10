import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

type SoundCloudWidget = {
  play: () => void;
  pause: () => void;
  bind: (event: string, listener: () => void) => void;
  unbind: (event?: string, listener?: () => void) => void;
  isPaused: (callback: (paused: boolean) => void) => void;
  setLoop: (loop: boolean) => void;
};

export type AudioConsent = 'unknown' | 'granted' | 'declined';

type WelcomeAudioContextValue = {
  play: () => Promise<void>;
  pause: () => void;
  isPlaying: boolean;
  ready: boolean;
  error?: string;
  audioConsent: AudioConsent;
  grantAudioConsent: () => void;
  declineAudioConsent: () => void;
  showPauseHint: boolean;
  setShowPauseHint: (show: boolean) => void;
  showDarkModeHint: boolean;
  setShowDarkModeHint: (show: boolean) => void;
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
  showPauseHint: false,
  setShowPauseHint: () => {},
  showDarkModeHint: false,
  setShowDarkModeHint: () => {},
});

const WIDGET_SCRIPT_SRC = 'https://w.soundcloud.com/player/api.js';
const TRACK_EMBED_URL =
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A298021432&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';
const AUDIO_CONSENT_STORAGE_KEY = 'danhenderson-welcome-audio-consent';
const LEGACY_AUDIO_PROMPT_STORAGE_KEY = 'danhenderson-welcome-audio-prompt';
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

const getStoredAudioConsent = (): AudioConsent => {
  if (typeof window === 'undefined') return 'unknown';

  const storedConsent = window.localStorage.getItem(AUDIO_CONSENT_STORAGE_KEY);
  if (storedConsent === 'granted' || storedConsent === 'declined') {
    return storedConsent;
  }

  if (window.localStorage.getItem(LEGACY_AUDIO_PROMPT_STORAGE_KEY) === 'dismissed') {
    return 'declined';
  }

  return 'unknown';
};

const persistAudioConsent = (consent: Exclude<AudioConsent, 'unknown'>) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(AUDIO_CONSENT_STORAGE_KEY, consent);
  window.localStorage.removeItem(LEGACY_AUDIO_PROMPT_STORAGE_KEY);
};

const loadWidgetScript = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available.'));
  }

  if ((window as any).SC?.Widget) {
    return Promise.resolve();
  }

  if (widgetScriptPromise) {
    return widgetScriptPromise;
  }

  widgetScriptPromise = new Promise<void>((resolve, reject) => {
    const resolveWhenReady = () => {
      if ((window as any).SC?.Widget) {
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

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SCRIPT_SRC}"]`);
    if (existingScript) {
      if ((window as any).SC?.Widget) {
        resolve();
        return;
      }

      existingScript.addEventListener('load', resolveWhenReady, { once: true });
      existingScript.addEventListener('error', rejectLoad, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = resolveWhenReady;
    script.onerror = rejectLoad;
    document.body.appendChild(script);
  });

  return widgetScriptPromise;
};

const waitForIframe = (iframeRef: { current: HTMLIFrameElement | null }): Promise<HTMLIFrameElement> =>
  new Promise<HTMLIFrameElement>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available.'));
      return;
    }

    let attempts = 0;
    const maxAttempts = 250;

    const checkIframe = () => {
      if (iframeRef.current) {
        resolve(iframeRef.current);
        return;
      }

      attempts += 1;
      if (attempts > maxAttempts) {
        reject(new Error('Audio iframe did not mount in time.'));
        return;
      }

      window.setTimeout(checkIframe, 16);
    };

    checkIframe();
  });

export const WelcomeAudioProvider = ({ children }: PropsWithChildren<{}>) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const setupPromiseRef = useRef<Promise<SoundCloudWidget> | null>(null);
  const unmountedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [audioConsent, setAudioConsent] = useState<AudioConsent>(getStoredAudioConsent);
  const [showPauseHint, setShowPauseHint] = useState(false);
  const [showDarkModeHint, setShowDarkModeHint] = useState(false);

  useEffect(() => {
    unmountedRef.current = false;

    return () => {
      unmountedRef.current = true;
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

    if (widgetRef.current) {
      widgetRef.current.pause();
      widgetRef.current.unbind('ready');
      widgetRef.current.unbind('play');
      widgetRef.current.unbind('pause');
      widgetRef.current.unbind('finish');
      widgetRef.current = null;
    }

    setupPromiseRef.current = null;
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
    setShowPauseHint(false);
  }, []);

  const initializeWidget = useCallback(async (): Promise<SoundCloudWidget> => {
    if (setupPromiseRef.current) {
      return setupPromiseRef.current;
    }

    if (widgetRef.current && ready) {
      return widgetRef.current;
    }

    setupPromiseRef.current = (async () => {
      await loadWidgetScript();
      const iframe = await waitForIframe(iframeRef);
      const SC = (window as any).SC;

      if (!SC?.Widget) {
        throw new Error('SoundCloud widget API unavailable.');
      }

      const widget: SoundCloudWidget = SC.Widget(iframe);
      widgetRef.current = widget;

      await new Promise<void>((resolve) => {
        const markReady = () => {
          if (unmountedRef.current) return;

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

        widget.bind('ready', markReady);
        widget.bind('play', handlePlay);
        widget.bind('pause', handlePause);
        widget.bind('finish', handleFinish);
      });

      return widget;
    })().catch((err) => {
      setupPromiseRef.current = null;
      widgetRef.current = null;

      if (!unmountedRef.current) {
        setReady(false);
      }

      throw err;
    });

    return setupPromiseRef.current;
  }, [ready]);

  useEffect(() => {
    if (audioConsent !== 'granted') return;

    initializeWidget().catch((err) => {
      if (!unmountedRef.current) {
        setError('Unable to load welcome audio.');
      }
      console.error(err);
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
          showPauseHint,
          setShowPauseHint,
          showDarkModeHint,
          setShowDarkModeHint,
        }}
      >
        {children}
      </WelcomeAudioContext.Provider>
      {audioConsent === 'granted' && (
        <iframe
          ref={iframeRef}
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
