import { Box } from '@mui/material';
import { BlogPostCard } from './BlogPostCard';
import { StaggerChildren, MotionItem, fadeInUp } from '../../motion';
import type { BlogPostMeta } from '../../types/blog';

type BlogPostListProps = {
  posts: BlogPostMeta[];
  onTagClick?: (tag: string) => void;
};

export function BlogPostList({ posts, onTagClick }: BlogPostListProps) {
  if (posts.length === 0) return null;

  return (
    <StaggerChildren>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {posts.map((post) => (
          <MotionItem key={post.slug} variants={fadeInUp}>
            <BlogPostCard post={post} onTagClick={onTagClick} />
          </MotionItem>
        ))}
      </Box>
    </StaggerChildren>
  );
}
