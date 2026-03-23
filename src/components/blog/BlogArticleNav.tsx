import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Text } from '../text';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionCard, hoverLift, tapShrink, cssDuration } from '../../motion';
import type { BlogPostMeta } from '../../types/blog';

type BlogArticleNavProps = {
  prev?: BlogPostMeta;
  next?: BlogPostMeta;
};

function NavCard({ post, direction }: { post: BlogPostMeta; direction: 'prev' | 'next' }) {
  const componentStyles = useComponentStyles();
  const isPrev = direction === 'prev';

  return (
    <MotionCard hoverState={hoverLift} tapState={tapShrink}>
      <Box
        component={RouterLink}
        to={`/blog/${post.slug}`}
        sx={{
          ...componentStyles.contentCardSx,
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          transition: `box-shadow ${cssDuration.fast} ease`,
          '&:hover': { boxShadow: 4 },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        <Stack
          spacing={0.5}
          sx={{
            p: 2.5,
            alignItems: isPrev ? 'flex-start' : 'flex-end',
            textAlign: isPrev ? 'left' : 'right',
          }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: 'primary.main' }}>
            {isPrev && <ArrowBackIcon sx={{ fontSize: 16 }} />}
            <Text
              role="label"
              tone="accent"
              component="span"
              sx={{
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {isPrev ? 'Previous' : 'Next'}
            </Text>
            {!isPrev && <ArrowForwardIcon sx={{ fontSize: 16 }} />}
          </Stack>
          <Text
            role="cardTitle"
            component="p"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              lineHeight: 1.4,
            }}
          >
            {post.title}
          </Text>
        </Stack>
      </Box>
    </MotionCard>
  );
}

export function BlogArticleNav({ prev, next }: BlogArticleNavProps) {
  if (!prev && !next) return null;

  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: 'auto',
        mt: 6,
        mb: 2,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
        {prev ? <NavCard post={prev} direction="prev" /> : <Box sx={{ flex: 1 }} />}
        {next ? <NavCard post={next} direction="next" /> : <Box sx={{ flex: 1 }} />}
      </Stack>
    </Box>
  );
}
