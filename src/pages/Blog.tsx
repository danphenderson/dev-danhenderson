import { useState } from 'react';
import { Stack } from '@mui/material';
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
import { MotionSection } from '../motion';
import { Text } from '../components/text';

export default function Blog() {
  const appStyles = useAppStyles();
  useDocumentMetadata({
    ...siteRouteMap.blog,
    canonicalPath: siteRouteMap.blog.path,
  });

  const { posts, postMeta, featuredPost, tags } = useBlogData();
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
          <SectionCard delayMs={0} triggerOnView={false}>
            <Stack spacing={1}>
              <SectionHeading
                overline="Blog"
                subtitle="Technical writing on frontend architecture, React patterns, and software engineering."
                sx={appStyles.compactSectionHeadingSx}
              />
              <Text role="bodyMuted">
                {posts.length} article{posts.length !== 1 ? 's' : ''}
              </Text>
            </Stack>
          </SectionCard>
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
