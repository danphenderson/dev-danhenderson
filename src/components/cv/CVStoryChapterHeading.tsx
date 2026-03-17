import { Stack, Typography } from '@mui/material';
import type { CVStoryChapter } from '../../types/cv';

type CVStoryChapterHeadingProps = {
  chapter: CVStoryChapter;
  index: number;
};

export const CVStoryChapterHeading = ({ chapter, index }: CVStoryChapterHeadingProps) => (
  <Stack
    spacing={0.5}
    sx={{ pt: index > 0 ? 2 : 0 }}
    data-testid={`cv-story-chapter-${chapter.key}`}
  >
    <Typography variant="overline" color="text.secondary">
      Chapter {index + 1}
    </Typography>
    <Typography variant="h6" component="h2">
      {chapter.title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {chapter.narrative}
    </Typography>
  </Stack>
);
