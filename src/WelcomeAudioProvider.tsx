import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';

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

const AUDIO_SRC = '/assets/verse.mp3';

export const WelcomeAudioProvider = ({ children }: PropsWithChildren<{}>) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audioRef.current = audio;
    setReady(true);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      setError(undefined);
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      setError('Unable to play welcome audio.');
      throw err;
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  return (
    <WelcomeAudioContext.Provider value={{ play, pause, isPlaying, ready, error }}>
      {children}
    </WelcomeAudioContext.Provider>
  );
};

export const useWelcomeAudio = () => useContext(WelcomeAudioContext);
