import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCommandPalette } from '../CommandPaletteProvider';
import type { RecoverySuggestion } from '../constants/recoveryContext';
import type { SharedRouteAction } from '../constants/routeActions';

type RecoveryRouteActionView = SharedRouteAction & {
  routeStatusLabel?: string;
};

type RouteRecoveryPanelProps = {
  attemptedPathLabel: string;
  routeHintLabel?: string | null;
  contextualSuggestions: RecoverySuggestion[];
  recoveryActions: RecoveryRouteActionView[];
  suggestedPaletteQuery: string;
};

const cardSx = {
  px: 2,
  py: 1.5,
  borderRadius: 2,
  bgcolor: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(8px)',
} as const;

export const RouteRecoveryPanel = ({
  attemptedPathLabel,
  routeHintLabel,
  contextualSuggestions,
  recoveryActions,
  suggestedPaletteQuery,
}: RouteRecoveryPanelProps) => {
  const { openPalette } = useCommandPalette();

  const handleOpenPalette = () => {
    openPalette(suggestedPaletteQuery);
  };

  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: 720 }}>
      <Stack spacing={1}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" sx={{ opacity: 0.78 }}>
            Attempted path
          </Typography>
          <Chip label={attemptedPathLabel} size="small" sx={{ maxWidth: '100%' }} />
        </Stack>
        {routeHintLabel && (
          <Typography variant="body2" sx={{ opacity: 0.82 }}>
            {routeHintLabel}
          </Typography>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleOpenPalette}>
            Open command palette
          </Button>
          <Typography variant="caption" sx={{ alignSelf: 'center', opacity: 0.7 }}>
            {suggestedPaletteQuery
              ? `Prefilled with "${suggestedPaletteQuery}" for faster recovery.`
              : 'Search all routes, albums, and CV sections.'}
          </Typography>
        </Stack>
      </Stack>

      {contextualSuggestions.length > 0 && (
        <Stack spacing={1.25}>
          <Typography variant="subtitle2">Suggested destinations</Typography>
          {contextualSuggestions.map((suggestion) => (
            <Stack
              key={suggestion.id}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              sx={cardSx}
            >
              <Box>
                <Typography variant="subtitle2">{suggestion.label}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.82 }}>
                  {suggestion.description}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {suggestion.matchReason}
                </Typography>
              </Box>
              <Button variant="outlined" component={RouterLink} to={suggestion.path}>
                Open {suggestion.label}
              </Button>
            </Stack>
          ))}
        </Stack>
      )}

      <Stack spacing={1.25}>
        <Typography variant="subtitle2">Shared recovery routes</Typography>
        {recoveryActions.map((action, index) => (
          <Stack
            key={action.id}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.25}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={cardSx}
          >
            <Box>
              <Typography variant="subtitle2">{action.label}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.82 }}>
                {action.description}
              </Typography>
              {action.routeStatusLabel && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {action.routeStatusLabel}
                </Typography>
              )}
            </Box>
            <Button
              variant={index === 0 ? 'contained' : 'outlined'}
              component={RouterLink}
              to={action.path}
            >
              {index === 0 ? 'Go home' : `Open ${action.label}`}
            </Button>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
