import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { ANIMATED_CARD_DURATION_MS } from '../components/AnimatedContentCard';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { BlogHero } from '../components/blog/BlogHero';
import { BlogPostList } from '../components/blog/BlogPostList';
import { BlogTagFilter } from '../components/blog/BlogTagFilter';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useBlogData } from '../hooks/useBlogData';
import { useAppStyles } from '../styles/appStyles';
import { MotionSection, MotionTiltCard, useMotionScale } from '../motion';
import { Text, TypewriterText } from '../components/text';

export default function Blog() {
  const appStyles = useAppStyles();
  useDocumentMetadata({
    ...siteRouteMap.blog,
    canonicalPath: siteRouteMap.blog.path,
  });

  const { posts, postMeta, featuredPost, tags } = useBlogData();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [hasIntroEntered, setHasIntroEntered] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const { duration: durationScale } = useMotionScale();

  useEffect(() => {
    if (!hasIntroEntered) {
      return undefined;
    }

    if (durationScale === 0) {
      setIsIntroPlaying(true);
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => {
        setIsIntroPlaying(true);
      },
      Math.round(ANIMATED_CARD_DURATION_MS * durationScale)
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationScale, hasIntroEntered]);

  const nonFeaturedPosts = postMeta.filter((post) => post.slug !== featuredPost?.slug);

  const filteredPosts = activeTag
    ? nonFeaturedPosts.filter((post) => post.tags.includes(activeTag))
    : nonFeaturedPosts;

  const filteredFeaturedPost =
    activeTag && featuredPost && !featuredPost.tags.includes(activeTag) ? null : featuredPost;

  return (
    <PageFrame image="assets/photography/landscape/landscape-lime-kiln.jpg">
      <Stack spacing={3}>
        <MotionSection>
          <MotionTiltCard intensity={0.5}>
            <SectionCard
              delayMs={0}
              triggerOnView={false}
              onVisible={() => setHasIntroEntered(true)}
            >
              <Stack spacing={1}>
                <SectionHeading overline="Blog" sx={appStyles.compactSectionHeadingSx} />
                <Text role="sectionSubtitle">
                  <TypewriterText
                    text="Future home of technical notes on software engineering and applied mathematics."
                    playing={isIntroPlaying}
                    timingPreset="body"
                  />
                </Text>
                <Text role="bodyMuted">
                  {posts.length} article{posts.length !== 1 ? 's' : ''}
                </Text>
              </Stack>
            </SectionCard>
          </MotionTiltCard>
        </MotionSection>

        {filteredFeaturedPost && <BlogHero post={filteredFeaturedPost} />}

        <BlogTagFilter tags={tags} activeTag={activeTag} onTagChange={setActiveTag} />

        {filteredPosts.length > 0 && (
          <Stack spacing={1.5}>
            <MotionSection>
              <SectionHeading overline="Recent Articles" />
            </MotionSection>
            <BlogPostList posts={filteredPosts} onTagClick={setActiveTag} />
          </Stack>
        )}
      </Stack>
    </PageFrame>
  );
}
