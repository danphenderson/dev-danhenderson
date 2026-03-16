import { Box, Stack, Typography } from '@mui/material';
import { BlogMetaChips } from './BlogMetaChips';
import { MotionSection } from '../../motion';
import type { BlogPost } from '../../types/blog';

type BlogArticleHeaderProps = {
  post: BlogPost;
};

export function BlogArticleHeader({ post }: BlogArticleHeaderProps) {
  return (
    <MotionSection>
      <Stack spacing={2}>
        {post.heroImage && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: 200, sm: 280, md: 380 },
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={post.heroImage}
              alt={post.heroImageAlt ?? ''}
              loading="eager"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: (theme) =>
                  `linear-gradient(to top, ${theme.palette.background.default}cc 0%, transparent 50%)`,
              }}
            />
          </Box>
        )}

        <Stack
          spacing={1.5}
          sx={{
            ...(post.heroImage && { mt: { xs: -4, sm: -6, md: -8 } }),
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {post.title}
          </Typography>

          {post.subtitle && (
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: 680,
              }}
            >
              {post.subtitle}
            </Typography>
          )}

          <BlogMetaChips
            publishedAt={post.publishedAt}
            readingTimeMinutes={post.readingTimeMinutes}
            tags={post.tags}
          />
        </Stack>
      </Stack>
    </MotionSection>
  );
}
