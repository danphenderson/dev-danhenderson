import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useCommandPalette } from '../CommandPaletteProvider';
import { SectionPanel } from './layout/SectionPanel';
import { MetaText, SecondaryBodyText, SecondaryCaptionText, SubsectionTitle } from './text';
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
          <MetaText component="span" sx={{ opacity: 0.78 }}>
            Attempted path
          </MetaText>
          <Chip label={attemptedPathLabel} size="small" sx={{ maxWidth: '100%' }} />
        </Stack>
        {routeHintLabel && (
          <SecondaryBodyText sx={{ opacity: 0.82 }}>{routeHintLabel}</SecondaryBodyText>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleOpenPalette}>
            Open command palette
          </Button>
          <SecondaryCaptionText sx={{ alignSelf: 'center', opacity: 0.7 }}>
            {suggestedPaletteQuery
              ? `Prefilled with "${suggestedPaletteQuery}" for faster recovery.`
              : 'Search all routes, albums, and CV sections.'}
          </SecondaryCaptionText>
        </Stack>
      </Stack>

      {contextualSuggestions.length > 0 && (
        <Stack spacing={1.25}>
          <SubsectionTitle component="h2">Suggested destinations</SubsectionTitle>
          {contextualSuggestions.map((suggestion) => (
            <SectionPanel key={suggestion.id} sx={rowPanelSx}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <SubsectionTitle component="p">{suggestion.label}</SubsectionTitle>
                <SecondaryBodyText sx={{ opacity: 0.82 }}>
                  {suggestion.description}
                </SecondaryBodyText>
                <SecondaryCaptionText sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {suggestion.matchReason}
                </SecondaryCaptionText>
              </Box>
              <Button variant="outlined" component={RouterLink} to={suggestion.path}>
                Open {suggestion.label}
              </Button>
            </SectionPanel>
          ))}
        </Stack>
      )}

      <Stack spacing={1.25}>
        <SubsectionTitle component="h2">Shared recovery routes</SubsectionTitle>
        {recoveryActions.map((action, index) => (
          <SectionPanel key={action.id} sx={rowPanelSx}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SubsectionTitle component="p">{action.label}</SubsectionTitle>
              <SecondaryBodyText sx={{ opacity: 0.82 }}>{action.description}</SecondaryBodyText>
              {action.routeStatusLabel && (
                <SecondaryCaptionText sx={{ display: 'block', mt: 0.5, opacity: 0.68 }}>
                  {action.routeStatusLabel}
                </SecondaryCaptionText>
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
