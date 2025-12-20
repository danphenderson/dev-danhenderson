import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

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
};

const WelcomeAudioContext = createContext<WelcomeAudioContextValue>({
  play: async () => {},
  pause: () => {},
  isPlaying: false,
  ready: false,
  error: undefined,
});

const WIDGET_SCRIPT_SRC = 'https://w.soundcloud.com/player/api.js';
const TRACK_EMBED_URL =
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A298021432&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true';

export const WelcomeAudioProvider = ({ children }: PropsWithChildren<{}>) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    const loadWidgetScript = () =>
      new Promise<void>((resolve, reject) => {
        if ((window as any).SC && (window as any).SC.Widget) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = WIDGET_SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load SoundCloud widget'));
        document.body.appendChild(script);
      });

    const setupWidget = async () => {
      try {
        await loadWidgetScript();
        if (!iframeRef.current || cancelled) return;

        const SC = (window as any).SC;
        const widget: SoundCloudWidget = SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        const markReady = () => {
          if (cancelled) return;
          setReady(true);
          widget.isPaused((paused: boolean) => setIsPlaying(!paused));
        };

        const handlePlay = () => !cancelled && setIsPlaying(true);
        const handlePause = () => !cancelled && setIsPlaying(false);

        const handleFinish = () => {
          if (cancelled) return;
          widget.play();
          setIsPlaying(true);
        };

        widget.bind('ready', markReady);
        widget.bind('play', handlePlay);
        widget.bind('pause', handlePause);
        widget.bind('finish', handleFinish);
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load welcome audio.');
        }
        console.error(err);
      }
    };

    setupWidget();

    return () => {
      cancelled = true;
      if (widgetRef.current) {
        widgetRef.current.unbind('ready');
        widgetRef.current.unbind('play');
        widgetRef.current.unbind('pause');
        widgetRef.current.unbind('finish');
      }
    };
  }, []);

  const play = useCallback(async () => {
    if (!widgetRef.current) {
      throw new Error('Audio not ready');
    }

    try {
      setError(undefined);
      widgetRef.current.play();
    } catch (err) {
      setError('Unable to play welcome audio.');
      throw err;
    }
  }, []);

  const pause = useCallback(() => {
    if (!widgetRef.current) return;
    widgetRef.current.pause();
  }, []);

  return (
    <>
      <WelcomeAudioContext.Provider value={{ play, pause, isPlaying, ready, error }}>
        {children}
      </WelcomeAudioContext.Provider>
      <iframe
        ref={iframeRef}
        title="Welcome audio"
        src={TRACK_EMBED_URL}
        allow="autoplay"
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          border: 0,
          clipPath: 'inset(50%)',
          clip: 'rect(0 0 0 0)',
          overflow: 'hidden',
        }}
        aria-hidden={true}
      />
    </>
  );
};

export const useWelcomeAudio = () => useContext(WelcomeAudioContext);
