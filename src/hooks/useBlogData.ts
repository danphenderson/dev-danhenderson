import { blogPosts } from '../data/blog';
import type { BlogPost, BlogPostMeta } from '../types/blog';

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

const posts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const postMeta = posts.map(toMeta);

const featuredPost = posts.find((post) => post.featured) ?? posts[0];

const tags = (() => {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
})();

function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const current = getPostBySlug(slug);

  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags);

  const scored = posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => toMeta(entry.post));
}

function getAdjacentPosts(slug: string): { prev?: BlogPostMeta; next?: BlogPostMeta } {
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return {};
  }

  return {
    prev: index > 0 ? toMeta(posts[index - 1]) : undefined,
    next: index < posts.length - 1 ? toMeta(posts[index + 1]) : undefined,
  };
}

const blogData = {
  posts,
  postMeta,
  featuredPost,
  tags,
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
};

export function useBlogData() {
  return blogData;
}
