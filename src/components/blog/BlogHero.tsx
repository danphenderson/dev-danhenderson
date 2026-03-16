import { Box, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { BlogMetaChips } from './BlogMetaChips';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionSection } from '../../motion';
import type { BlogPost } from '../../types/blog';

type BlogHeroProps = {
  post: BlogPost;
};

export function BlogHero({ post }: BlogHeroProps) {
  const componentStyles = useComponentStyles();

  return (
    <MotionSection>
      <Box
        component={RouterLink}
        to={`/blog/${post.slug}`}
        sx={{
          ...componentStyles.contentCardSx,
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          cursor: 'pointer',
          transition:
            'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 8,
          },
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
              position: 'relative',
              width: '100%',
              height: { xs: 200, sm: 280, md: 360 },
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
                  `linear-gradient(to top, ${theme.palette.background.default}ee 0%, transparent 60%)`,
              }}
            />
          </Box>
        )}

        <Stack
          spacing={1.5}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            ...(post.heroImage && { mt: { xs: -6, sm: -8, md: -10 } }),
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            component="p"
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            Featured Article
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.15,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {post.title}
          </Typography>

          {post.subtitle && (
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                maxWidth: 640,
              }}
            >
              {post.subtitle}
            </Typography>
          )}

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              maxWidth: 680,
              lineHeight: 1.7,
            }}
          >
            {post.excerpt}
          </Typography>

          <BlogMetaChips
            publishedAt={post.publishedAt}
            readingTimeMinutes={post.readingTimeMinutes}
            tags={post.tags}
          />
        </Stack>
      </Box>
    </MotionSection>
  );
}
