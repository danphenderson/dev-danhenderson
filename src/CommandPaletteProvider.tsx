import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type CommandPaletteContextValue = {
  isOpen: boolean;
  query: string;
  openPalette: (initialQuery?: string) => void;
  closePalette: () => void;
  setQuery: (nextQuery: string) => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  isOpen: false,
  query: '',
  openPalette: () => {},
  closePalette: () => {},
  setQuery: () => {},
});

export const CommandPaletteProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const openPalette = useCallback((initialQuery = '') => {
    setQuery(initialQuery);
    setIsOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      query,
      openPalette,
      closePalette,
      setQuery,
    }),
    [closePalette, isOpen, openPalette, query]
  );

  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
};

export const useCommandPalette = () => useContext(CommandPaletteContext);
