import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionSection, StaggerChildren, MotionItem, cssDuration } from '../../motion';
import type { BlogPostMeta } from '../../types/blog';
import { BlogMetaChips } from './BlogMetaChips';

type BlogRelatedPostsProps = {
  posts: BlogPostMeta[];
};

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  const componentStyles = useComponentStyles();

  if (posts.length === 0) return null;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', mt: 6 }}>
      <MotionSection>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          Related articles
        </Typography>
        <StaggerChildren>
          <Stack spacing={2}>
            {posts.map((post) => (
              <MotionItem key={post.slug}>
                <Box
                  component={RouterLink}
                  to={`/blog/${post.slug}`}
                  sx={{
                    ...componentStyles.contentCardSx,
                    display: 'block',
                    textDecoration: 'none',
                    p: 2.5,
                    transition: `transform ${cssDuration.fast} ease, box-shadow ${cssDuration.fast} ease`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <BlogMetaChips
                    publishedAt={post.publishedAt}
                    readingTimeMinutes={post.readingTimeMinutes}
                    tags={post.tags}
                    compact
                    maxTags={2}
                  />
                </Box>
              </MotionItem>
            ))}
          </Stack>
        </StaggerChildren>
      </MotionSection>
    </Box>
  );
}
