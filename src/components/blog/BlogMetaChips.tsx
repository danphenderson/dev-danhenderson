import { Chip, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CaptionText } from '../text';
import { useComponentStyles } from '../../styles/componentStyles';

type BlogMetaChipsProps = {
  publishedAt: string;
  readingTimeMinutes: number;
  tags?: string[];
  onTagClick?: (tag: string) => void;
  compact?: boolean;
  maxTags?: number;
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function BlogMetaChips({
  publishedAt,
  readingTimeMinutes,
  tags,
  onTagClick,
  compact,
  maxTags,
}: BlogMetaChipsProps) {
  const componentStyles = useComponentStyles();
  const displayTags = maxTags && tags ? tags.slice(0, maxTags) : tags;

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <CaptionText>{formatDate(publishedAt)}</CaptionText>
      </Stack>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
        <CaptionText>{readingTimeMinutes} min read</CaptionText>
      </Stack>
      {displayTags && displayTags.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {displayTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
              sx={[
                {
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  textTransform: 'lowercase',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  cursor: onTagClick ? 'pointer' : 'default',
                  ...(compact && { display: { xs: 'none', sm: 'flex' } }),
                },
                componentStyles.chipWaveSx,
              ]}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
