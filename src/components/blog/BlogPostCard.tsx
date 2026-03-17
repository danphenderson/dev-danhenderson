import { Box, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogMetaChips } from './BlogMetaChips';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionCard, hoverLift, tapShrink, cssDuration } from '../../motion';
import type { BlogPostMeta } from '../../types/blog';

type BlogPostCardProps = {
  post: BlogPostMeta;
  onTagClick?: (tag: string) => void;
};

export function BlogPostCard({ post, onTagClick }: BlogPostCardProps) {
  const componentStyles = useComponentStyles();

  return (
    <MotionCard hoverState={hoverLift} tapState={tapShrink}>
      <Box
        component={RouterLink}
        to={`/blog/${post.slug}`}
        sx={{
          ...componentStyles.contentCardSx,
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
          borderRadius: 2.5,
          overflow: 'hidden',
          height: '100%',
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        {post.heroImage && (
          <Box
            sx={{
              width: '100%',
              height: { xs: 140, sm: 160 },
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={post.heroImage}
              alt={post.heroImageAlt ?? ''}
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: `transform ${cssDuration.slow} ease`,
              }}
            />
          </Box>
        )}

        <Stack spacing={1} sx={{ p: { xs: 2, sm: 2.5 }, flex: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              fontSize: { xs: '1rem', sm: '1.1rem' },
            }}
          >
            {post.title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {post.excerpt}
          </Typography>

          <BlogMetaChips
            publishedAt={post.publishedAt}
            readingTimeMinutes={post.readingTimeMinutes}
            tags={post.tags.slice(0, 2)}
            onTagClick={onTagClick}
            compact
          />
        </Stack>
      </Box>
    </MotionCard>
  );
}
