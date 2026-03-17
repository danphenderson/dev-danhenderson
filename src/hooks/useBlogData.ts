import { useMemo, useCallback } from 'react';
import { blogPosts } from '../data/blog';
import type { BlogPost, BlogPostMeta } from '../types/blog';
import type { SharedDataStatus } from '../types/data';

function toMeta(post: BlogPost): BlogPostMeta {
  return {
    slug: post.slug,
    title: post.title,
    subtitle: post.subtitle,
    excerpt: post.excerpt,
    author: post.author,
    publishedAt: post.publishedAt,
    readingTimeMinutes: post.readingTimeMinutes,
    tags: post.tags,
    featured: post.featured,
    heroImage: post.heroImage,
    heroImageAlt: post.heroImageAlt,
  };
}

export function useBlogData() {
  const status: SharedDataStatus = {
    source: 'static',
    loading: false,
    error: null,
    isFallback: false,
    reason: 'bundled-content',
    freshness: {
      label: 'Bundled blog content available in the client build.',
      isStale: false,
    },
  };

  const posts = useMemo(
    () => [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    []
  );

  const postMeta = useMemo(() => posts.map(toMeta), [posts]);

  const featuredPost = useMemo(() => posts.find((p) => p.featured) ?? posts[0], [posts]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const getPostBySlug = useCallback(
    (slug: string): BlogPost | undefined => posts.find((p) => p.slug === slug),
    [posts]
  );

  const getRelatedPosts = useCallback(
    (slug: string, limit = 3): BlogPostMeta[] => {
      const current = posts.find((p) => p.slug === slug);
      if (!current) return [];

      const scored = posts
        .filter((p) => p.slug !== slug)
        .map((p) => {
          const shared = p.tags.filter((t) => current.tags.includes(t)).length;
          return { post: p, score: shared };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      return scored.slice(0, limit).map((entry) => toMeta(entry.post));
    },
    [posts]
  );

  const getAdjacentPosts = useCallback(
    (slug: string): { prev?: BlogPostMeta; next?: BlogPostMeta } => {
      const index = posts.findIndex((p) => p.slug === slug);
      if (index === -1) return {};
      return {
        prev: index > 0 ? toMeta(posts[index - 1]) : undefined,
        next: index < posts.length - 1 ? toMeta(posts[index + 1]) : undefined,
      };
    },
    [posts]
  );

  return {
    posts,
    postMeta,
    featuredPost,
    tags,
    getPostBySlug,
    getRelatedPosts,
    getAdjacentPosts,
    status,
  };
}
