import { useMemo } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { BlogArticleHeader } from '../components/blog/BlogArticleHeader';
import { BlogArticleBody } from '../components/blog/BlogArticleBody';
import { BlogArticleNav } from '../components/blog/BlogArticleNav';
import { BlogRelatedPosts } from '../components/blog/BlogRelatedPosts';
import { RouteRecoveryPanel } from '../components/RouteRecoveryPanel';
import { getRecoveryContext } from '../constants/recoveryContext';
import { recoveryRouteActions } from '../constants/routeActions';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useBlogData } from '../hooks/useBlogData';
import { useAppStyles } from '../styles/appStyles';
import { SecondaryBodyText } from '../components/text';
import { MotionSection } from '../motion';

export default function BlogPost() {
  const appStyles = useAppStyles();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const { getPostBySlug, getRelatedPosts, getAdjacentPosts } = useBlogData();

  const post = slug ? getPostBySlug(slug) : undefined;
  const related = useMemo(() => (slug ? getRelatedPosts(slug, 3) : []), [slug, getRelatedPosts]);
  const adjacent = useMemo(() => (slug ? getAdjacentPosts(slug) : {}), [slug, getAdjacentPosts]);
  const recoveryContext = useMemo(() => getRecoveryContext(location.pathname), [location.pathname]);
  const recoveryActions = useMemo(
    () =>
      recoveryRouteActions.map((action) => ({
        ...action,
        routeStatusLabel: siteRouteMap[action.routeId].status?.label,
      })),
    []
  );

  useDocumentMetadata(
    post
      ? {
          title: `${post.title} | Daniel Henderson`,
          description: post.excerpt,
          image: post.heroImage,
          canonicalPath: `/blog/${post.slug}`,
        }
      : {
          ...siteRouteMap['not-found'],
          description:
            'This blog post does not exist or has moved. Browse the blog index to find more articles.',
          image: siteRouteMap.blog.image,
          canonicalPath: siteRouteMap.blog.path,
          noIndex: true,
        }
  );

  const backgroundImage = post?.heroImage ?? 'assets/photography/landscape/landscape-lime-kiln.jpg';

  return (
    <PageFrame image={backgroundImage}>
      <Stack spacing={3}>
        <MotionSection>
          <SectionCard delayMs={0} triggerOnView={false}>
            <Button
              component={RouterLink}
              to="/blog"
              startIcon={<ArrowBackIcon />}
              size="small"
              sx={appStyles.inlineStartSx}
            >
              Back to blog
            </Button>
          </SectionCard>
        </MotionSection>

        {post ? (
          <>
            <BlogArticleHeader post={post} />

            <MotionSection>
              <SectionCard>
                <BlogArticleBody content={post.content} />
              </SectionCard>
            </MotionSection>

            <BlogArticleNav prev={adjacent.prev} next={adjacent.next} />
            <BlogRelatedPosts posts={related} />
          </>
        ) : (
          <MotionSection>
            <SectionCard>
              <Stack spacing={2.5}>
                <Stack spacing={1} sx={{ maxWidth: { md: 760 } }}>
                  <Typography
                    component="p"
                    variant="overline"
                    sx={{
                      display: 'block',
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Blog
                  </Typography>
                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      color: 'text.primary',
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      lineHeight: 1.05,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Post not found
                  </Typography>
                </Stack>
                <SecondaryBodyText>
                  This article does not exist or has been moved. Use the command palette or recovery
                  links below to navigate to another page.
                </SecondaryBodyText>
                <RouteRecoveryPanel
                  attemptedPathLabel={recoveryContext.attemptedPathLabel}
                  routeHintLabel={recoveryContext.routeHintLabel}
                  contextualSuggestions={recoveryContext.contextualSuggestions}
                  recoveryActions={recoveryActions}
                  suggestedPaletteQuery={recoveryContext.suggestedPaletteQuery}
                />
              </Stack>
            </SectionCard>
          </MotionSection>
        )}
      </Stack>
    </PageFrame>
  );
}
