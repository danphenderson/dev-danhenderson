import { Box, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Text } from '../text';
import { BlogHeroImage } from './BlogHeroImage';
import { BlogMetaChips } from './BlogMetaChips';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionSection, cssDuration } from '../../motion';
import { SPRING_EASING_CSS } from '../../styles/springEasing';
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
          transition: `transform ${cssDuration.normal} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.normal} ease`,
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
          <BlogHeroImage
            src={post.heroImage}
            alt={post.heroImageAlt}
            height={{ xs: 200, sm: 280, md: 360 }}
            overlayOpacity={0.93}
            overlayFadeStop="60%"
          />
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
          <Text
            role="sectionEyebrow"
            tone="accent"
            component="p"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            Featured Article
          </Text>

          <Text
            role="proseTitle"
            component="h2"
            sx={{
              fontWeight: 800,
              lineHeight: 1.15,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {post.title}
          </Text>

          {post.subtitle && (
            <Text
              role="proseLead"
              tone="muted"
              sx={{
                fontStyle: 'italic',
                maxWidth: 640,
              }}
            >
              {post.subtitle}
            </Text>
          )}

          <Text
            role="body"
            tone="muted"
            sx={{
              maxWidth: 680,
              lineHeight: 1.7,
            }}
          >
            {post.excerpt}
          </Text>

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
