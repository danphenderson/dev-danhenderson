import { Box, Button, Chip, Stack } from '@mui/material';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import { useComponentStyles } from '../../styles/componentStyles';
import { cvStoryCta, cvStoryIntro } from '../../data/cv';
import type { CVMode } from '../../constants/siteRoutes';
import { Text } from '../text';

type CVStoryHeaderProps = {
  mode: CVMode;
  onToggleMode: () => void;
  variant?: 'page' | 'embedded';
};

export const CVStoryHeader = ({ mode, onToggleMode, variant = 'page' }: CVStoryHeaderProps) => {
  const { compactSidebarSectionSpacing } = useComponentStyles();
  const isStory = mode === 'story';
  const isEmbedded = variant === 'embedded';

  if (isEmbedded) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1.5,
          flexWrap: 'wrap',
          width: '100%',
        }}
        data-testid="cv-story-header"
      >
        <Chip
          icon={isStory ? <AutoStoriesOutlinedIcon /> : <ViewModuleOutlinedIcon />}
          label={isStory ? 'Story Mode' : 'Full CV'}
          size="small"
          color={isStory ? 'primary' : 'default'}
          variant="outlined"
        />
        <Button
          size="small"
          variant="text"
          startIcon={isStory ? <ViewModuleOutlinedIcon /> : <AutoStoriesOutlinedIcon />}
          onClick={onToggleMode}
          data-testid="cv-mode-toggle"
          sx={{ minWidth: 0, justifyContent: 'flex-start', textAlign: 'left', px: 0 }}
        >
          {isStory ? cvStoryCta.switchToDefault : cvStoryCta.switchToStory}
        </Button>
      </Box>
    );
  }

  return (
    <Stack
      spacing={compactSidebarSectionSpacing}
      alignItems="stretch"
      data-testid="cv-story-header"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
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
      {isStory && <Text role="metaStrong">{cvStoryIntro}</Text>}
      <Box>
        <Button
          size="small"
          variant="text"
          startIcon={isStory ? <ViewModuleOutlinedIcon /> : <AutoStoriesOutlinedIcon />}
          onClick={onToggleMode}
          data-testid="cv-mode-toggle"
        >
          {isStory ? cvStoryCta.switchToDefault : cvStoryCta.switchToStory}
        </Button>
      </Box>
    </Stack>
  );
};
