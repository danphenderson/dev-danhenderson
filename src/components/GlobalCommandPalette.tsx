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
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  commandPaletteActions,
  type CommandPaletteAction,
} from '../constants/commandPaletteActions';

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

const normalizeSearchValue = (value: string): string => value.trim().toLowerCase();

const matchesAction = (action: CommandPaletteAction, rawQuery: string): boolean => {
  const query = normalizeSearchValue(rawQuery);

  if (!query) {
    return true;
  }

  const haystacks = [action.label, action.description, ...action.keywords].map((value) =>
    value.toLowerCase()
  );

  return haystacks.some((value) => value.includes(query));
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredActions = useMemo(
    () => commandPaletteActions.filter((action) => matchesAction(action, query)),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key === '/') {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [location.key]);

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
    setOpen(false);
    setQuery('');
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
      open={open}
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
            <Typography id="command-palette-title" variant="h6">
              Command palette
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Press / or Cmd+K
            </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  No matching routes or sections.
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
