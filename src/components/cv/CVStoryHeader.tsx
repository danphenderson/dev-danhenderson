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
  chapterLabel?: string;
};

export const CVStoryHeader = ({ mode, onToggleMode, chapterLabel }: CVStoryHeaderProps) => {
  const { compactSidebarSectionSpacing } = useComponentStyles();
  const isStory = mode === 'story';

  return (
    <Stack spacing={compactSidebarSectionSpacing} data-testid="cv-story-header">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip
          icon={isStory ? <AutoStoriesOutlinedIcon /> : <ViewModuleOutlinedIcon />}
          label={isStory ? 'Story Mode' : 'Full CV'}
          size="small"
          color={isStory ? 'primary' : 'default'}
          variant="outlined"
        />
        {isStory && chapterLabel && (
          <Typography variant="caption" color="text.secondary">
            {chapterLabel}
          </Typography>
        )}
      </Box>
      {isStory && <SectionLeadText>{cvStoryIntro}</SectionLeadText>}
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
