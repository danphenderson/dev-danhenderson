import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCommandPalette } from '../CommandPaletteProvider';
import { SectionPanel } from './layout/SectionPanel';
import { Text } from './text';
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

const rowPanelSx = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1.25,
  alignItems: { xs: 'flex-start', sm: 'center' },
  justifyContent: 'space-between',
  p: { xs: 1.5, sm: 1.75 },
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
          <Text role="meta" component="span" sx={{ opacity: 0.78 }}>
            Attempted path
          </Text>
          <Chip label={attemptedPathLabel} size="small" sx={{ maxWidth: '100%' }} />
        </Stack>
        {routeHintLabel && (
          <Text role="bodyMuted" sx={{ opacity: 0.82 }}>
            {routeHintLabel}
          </Text>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleOpenPalette}>
            Open command palette
          </Button>
          <Text role="caption" tone="muted" sx={{ alignSelf: 'center', opacity: 0.7 }}>
            {suggestedPaletteQuery
              ? `Prefilled with "${suggestedPaletteQuery}" for faster recovery.`
              : 'Search all routes, albums, and CV sections.'}
          </Text>
        </Stack>
      </Stack>

      {contextualSuggestions.length > 0 && (
        <Stack spacing={1.25}>
          <Text role="subsectionTitle" component="h2">
            Suggested destinations
          </Text>
          {contextualSuggestions.map((suggestion) => (
            <SectionPanel key={suggestion.id} sx={rowPanelSx}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Text role="cardTitle" component="p">
                  {suggestion.label}
                </Text>
                <Text role="bodyMuted" sx={{ opacity: 0.82 }}>
                  {suggestion.description}
                </Text>
                <Text role="caption" tone="muted" sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {suggestion.matchReason}
                </Text>
              </Box>
              <Button variant="outlined" component={RouterLink} to={suggestion.path}>
                Open {suggestion.label}
              </Button>
            </SectionPanel>
          ))}
        </Stack>
      )}

      <Stack spacing={1.25}>
        <Text role="subsectionTitle" component="h2">
          Shared recovery routes
        </Text>
        {recoveryActions.map((action, index) => (
          <SectionPanel key={action.id} sx={rowPanelSx}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Text role="cardTitle" component="p">
                {action.label}
              </Text>
              <Text role="bodyMuted" sx={{ opacity: 0.82 }}>
                {action.description}
              </Text>
              {action.routeStatusLabel && (
                <Text role="caption" tone="muted" sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {action.routeStatusLabel}
                </Text>
              )}
            </Box>
            <Button
              variant={index === 0 ? 'contained' : 'outlined'}
              component={RouterLink}
              to={action.path}
            >
              {index === 0 ? 'Go home' : `Open ${action.label}`}
            </Button>
          </SectionPanel>
        ))}
      </Stack>
    </Stack>
  );
};
