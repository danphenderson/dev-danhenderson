import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Dialog,
  DialogContent,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  commandPaletteActions,
  type CommandPaletteAction,
} from '../constants/commandPaletteActions';
import { useCommandPalette } from '../CommandPaletteProvider';
import { CaptionText, EntryTitle, SecondaryBodyText } from './text';
import { matchesCommandPaletteAction } from '../utils/commandPaletteSearch';

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

const scrollToHashTarget = (hashFragment: string): boolean => {
  const target = document.getElementById(hashFragment);

  if (!target) {
    return false;
  }

  const headerOffsetPx = window.matchMedia('(max-width: 899.95px)').matches ? 88 : 112;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffsetPx;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: 'smooth',
  });

  return true;
};

export const GlobalCommandPalette = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, query, openPalette, closePalette, setQuery } = useCommandPalette();
  const previousPathnameRef = useRef(location.pathname);

  const filteredActions = useMemo(
    () => commandPaletteActions.filter((action) => matchesCommandPaletteAction(action, query)),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPalette();
        return;
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === '/') {
        event.preventDefault();
        openPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openPalette]);

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
      if (scrollToHashTarget(hashFragment)) {
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
  }, [location.hash, location.pathname]);

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
        scrollToHashTarget(hashFragment);
      });
      handleClose();
      return;
    }

    navigate(hash ? { pathname, hash } : pathname);
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
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
            <EntryTitle id="command-palette-title" component="h2">
              Command palette
            </EntryTitle>
            <CaptionText color="text.secondary">Press / or Cmd+K</CaptionText>
          </Box>
          <TextField
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search routes, albums, and CV sections"
            inputProps={{ 'aria-label': 'Search routes, albums, and CV sections' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <ListItemButton
                  key={action.id}
                  onClick={() => handleSelect(action)}
                  sx={{ borderRadius: 2, alignItems: 'flex-start' }}
                >
                  <ListItemText
                    primary={action.label}
                    secondary={action.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Box sx={{ px: 1, py: 2 }}>
                <SecondaryBodyText>No matching routes or sections.</SecondaryBodyText>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
