import { Link as RouterLink } from 'react-router-dom';
import { Box, Stack } from '@mui/material';
import { Text } from '../text';
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
        <Text
          role="subsectionTitle"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            letterSpacing: '-0.02em',
          }}
        >
          Related articles
        </Text>
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
                  <Text
                    role="cardTitle"
                    component="p"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {post.title}
                  </Text>
                  <Text
                    role="body"
                    tone="muted"
                    sx={{
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Text>
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
