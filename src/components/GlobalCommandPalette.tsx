import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Dialog,
  DialogContent,
  InputAdornment,
  List,
  ListItemButton,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMotionScale } from '../motion';
import {
  commandPaletteActions,
  type CommandPaletteAction,
} from '../constants/commandPaletteActions';
import { useCommandPalette } from '../CommandPaletteProvider';
import { Text } from './text';
import { matchesCommandPaletteAction } from '../utils/commandPaletteSearch';

const DIALOG_BASE_DURATION_MS = 225;

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

const scrollWindowTo = (top: number, disableScrollAnimation: boolean) => {
  const clampedTop = Math.max(0, top);

  if (!disableScrollAnimation) {
    window.scrollTo({
      top: clampedTop,
      behavior: 'smooth',
    });
    return;
  }

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  // Override the global smooth-scroll baseline so reduced-motion jumps instantly.
  root.style.scrollBehavior = 'auto';
  window.scrollTo({
    top: clampedTop,
    behavior: 'auto',
  });
  root.style.scrollBehavior = previousScrollBehavior;
};

const scrollToHashTarget = (hashFragment: string, disableScrollAnimation: boolean): boolean => {
  const target = document.getElementById(hashFragment);

  if (!target) {
    return false;
  }

  const headerOffsetPx = window.matchMedia('(max-width: 899.95px)').matches ? 88 : 112;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffsetPx;

  scrollWindowTo(top, disableScrollAnimation);

  return true;
};

export const GlobalCommandPalette = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { duration: durationFactor } = useMotionScale();
  const { isOpen, query, openPalette, closePalette, setQuery } = useCommandPalette();
  const [activeIndex, setActiveIndex] = useState(-1);
  const previousPathnameRef = useRef(location.pathname);
  const disableScrollAnimation = durationFactor === 0;
  const dialogTransitionDuration =
    durationFactor === 0 ? 0 : Math.round(DIALOG_BASE_DURATION_MS * durationFactor);

  const filteredActions = useMemo(
    () => commandPaletteActions.filter((action) => matchesCommandPaletteAction(action, query)),
    [query]
  );
  const activeAction =
    activeIndex >= 0 && activeIndex < filteredActions.length ? filteredActions[activeIndex] : undefined;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        if (!isOpen && isEditableTarget(event.target)) {
          return;
        }

        event.preventDefault();
        if (isOpen) {
          closePalette();
        } else {
          openPalette();
        }
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === '/') {
        event.preventDefault();
        openPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePalette, isOpen, openPalette]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(filteredActions.length > 0 ? 0 : -1);
  }, [filteredActions, isOpen]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return;
    }

    previousPathnameRef.current = location.pathname;
    closePalette();
  }, [closePalette, location.pathname]);

  useEffect(() => {
    const hashFragment = location.hash.replace(/^#/, '');

    if (!hashFragment) {
      return;
    }

    let attempts = 0;
    let timeoutId: number | undefined;

    const syncHashScroll = () => {
      if (scrollToHashTarget(hashFragment, disableScrollAnimation)) {
        return;
      }

      if (attempts >= 10) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(syncHashScroll, 120);
    };

    syncHashScroll();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [disableScrollAnimation, location.hash, location.pathname]);

  const handleClose = () => {
    closePalette();
  };

  const handleSelect = (action: CommandPaletteAction) => {
    const [pathname, hashFragment] = action.path.split('#');
    const hash = hashFragment ? `#${hashFragment}` : '';

    if (pathname === location.pathname && hashFragment) {
      if (location.hash !== hash) {
        navigate({ pathname, hash });
      }

      requestAnimationFrame(() => {
        scrollToHashTarget(hashFragment, disableScrollAnimation);
      });
      handleClose();
      return;
    }

    navigate(hash ? { pathname, hash } : pathname);
    handleClose();
  };

  const handleQueryKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredActions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((previousIndex) => (previousIndex + 1) % filteredActions.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((previousIndex) =>
        previousIndex <= 0 ? filteredActions.length - 1 : previousIndex - 1
      );
      return;
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(filteredActions[activeIndex]);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      transitionDuration={dialogTransitionDuration}
      aria-labelledby="command-palette-title"
    >
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Text role="cardTitle" id="command-palette-title" component="h2">
              Command palette
            </Text>
            <Text role="caption" tone="muted">
              Press / or Cmd+K
            </Text>
          </Box>
          <TextField
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleQueryKeyDown}
            placeholder="Search routes, albums, and CV sections"
            inputProps={{
              role: 'combobox',
              'aria-label': 'Search routes, albums, and CV sections',
              'aria-activedescendant': activeAction
                ? `command-palette-action-${activeAction.id}`
                : undefined,
              'aria-controls': 'command-palette-results',
              'aria-autocomplete': 'list',
              'aria-expanded': filteredActions.length > 0,
              'aria-haspopup': 'listbox',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <List
            component="ul"
            id="command-palette-results"
            role="listbox"
            aria-label="Command palette results"
            sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}
          >
            {filteredActions.length > 0 ? (
              filteredActions.map((action, index) => (
                <ListItemButton
                  component="li"
                  key={action.id}
                  id={`command-palette-action-${action.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(action)}
                  onMouseEnter={() => setActiveIndex(index)}
                  selected={index === activeIndex}
                  sx={{ borderRadius: 2, alignItems: 'flex-start' }}
                >
                  <Stack spacing={0.375} sx={{ minWidth: 0 }}>
                    <Text role="label" component="span">
                      {action.label}
                    </Text>
                    <Text role="caption" tone="muted">
                      {action.description}
                    </Text>
                  </Stack>
                </ListItemButton>
              ))
            ) : (
              <Box role="status" sx={{ px: 1, py: 2 }}>
                <Text role="bodyMuted">No matching routes or sections.</Text>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
