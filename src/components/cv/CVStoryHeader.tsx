import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import { useComponentStyles } from '../../styles/componentStyles';
import { cvStoryCta, cvStoryIntro } from '../../data/cv';
import type { CVMode } from '../../constants/siteRoutes';
import { SectionLeadText } from '../text';

type CVStoryHeaderProps = {
  mode: CVMode;
  onToggleMode: () => void;
  variant?: 'page' | 'embedded';
};

export const CVStoryHeader = ({ mode, onToggleMode, variant = 'page' }: CVStoryHeaderProps) => {
  const { compactSidebarSectionSpacing } = useComponentStyles();
  const isStory = mode === 'story';
  const isEmbedded = variant === 'embedded';

  return (
    <Stack
      spacing={isEmbedded ? 0.75 : compactSidebarSectionSpacing}
      alignItems={isEmbedded ? 'flex-end' : 'stretch'}
      sx={isEmbedded ? { width: '100%' } : undefined}
      data-testid="cv-story-header"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          justifyContent: isEmbedded ? 'flex-end' : 'flex-start',
        }}
      >
        <Chip
          icon={isStory ? <AutoStoriesOutlinedIcon /> : <ViewModuleOutlinedIcon />}
          label={isStory ? 'Story Mode' : 'Full CV'}
          size="small"
          color={isStory ? 'primary' : 'default'}
          variant="outlined"
        />
      </Box>
      {!isEmbedded && isStory && <SectionLeadText>{cvStoryIntro}</SectionLeadText>}
      <Box
        sx={isEmbedded ? { display: 'flex', justifyContent: 'flex-end', width: '100%' } : undefined}
      >
        <Button
          size="small"
          variant="text"
          startIcon={isStory ? <ViewModuleOutlinedIcon /> : <AutoStoriesOutlinedIcon />}
          onClick={onToggleMode}
          data-testid="cv-mode-toggle"
          sx={
            isEmbedded ? { minWidth: 0, justifyContent: 'flex-end', textAlign: 'right' } : undefined
          }
        >
          {isStory ? cvStoryCta.switchToDefault : cvStoryCta.switchToStory}
        </Button>
      </Box>
    </Stack>
  );
};
