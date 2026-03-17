import { Stack, Typography } from '@mui/material';
import { BlogHeroImage } from './BlogHeroImage';
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
          <BlogHeroImage
            src={post.heroImage}
            alt={post.heroImageAlt}
            height={{ xs: 200, sm: 280, md: 380 }}
            borderRadius={3}
            overlayOpacity={0.8}
            overlayFadeStop="50%"
          />
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
