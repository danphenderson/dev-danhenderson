import { Chip, Stack } from '@mui/material';
import { Text } from '../text';
import { MotionSection } from '../../motion';
import { useComponentStyles } from '../../styles/componentStyles';

type BlogTagFilterProps = {
  tags: Array<{ tag: string; count: number }>;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
};

export function BlogTagFilter({ tags, activeTag, onTagChange }: BlogTagFilterProps) {
  const componentStyles = useComponentStyles();

  if (tags.length === 0) return null;

  return (
    <MotionSection>
      <Stack spacing={1}>
        <Text
          role="sectionEyebrow"
          tone="muted"
          component="span"
          sx={{ fontWeight: 700, letterSpacing: '0.08em' }}
        >
          Topics
        </Text>
        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <Chip
            label="All"
            size="small"
            variant={activeTag === null ? 'filled' : 'outlined'}
            color={activeTag === null ? 'primary' : 'default'}
            onClick={() => onTagChange(null)}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              textTransform: 'lowercase',
            }}
          />
          {tags.map(({ tag, count }) => (
            <Chip
              key={tag}
              label={`${tag} (${count})`}
              size="small"
              variant={activeTag === tag ? 'filled' : 'outlined'}
              color={activeTag === tag ? 'primary' : 'default'}
              onClick={() => onTagChange(activeTag === tag ? null : tag)}
              sx={[
                {
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  textTransform: 'lowercase',
                },
                componentStyles.chipWaveSx,
              ]}
            />
          ))}
        </Stack>
      </Stack>
    </MotionSection>
  );
}
