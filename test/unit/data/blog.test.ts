import { blogPosts } from '../../../src/data/blog';
import type { BlogPost, BlogContentBlock } from '../../../src/types/blog';

describe('blog.ts schema', () => {
  it('exports a non-empty blogPosts array', () => {
    expect(Array.isArray(blogPosts)).toBe(true);
    expect(blogPosts.length).toBeGreaterThan(0);
  });

  it('every post satisfies the BlogPost required fields', () => {
    for (const post of blogPosts) {
      const p: BlogPost = post; // type-level check
      expect(typeof p.slug).toBe('string');
      expect(p.slug.length).toBeGreaterThan(0);
      expect(typeof p.title).toBe('string');
      expect(p.title.length).toBeGreaterThan(0);
      expect(typeof p.excerpt).toBe('string');
      expect(p.excerpt.length).toBeGreaterThan(0);
      expect(typeof p.author).toBe('string');
      expect(p.author.length).toBeGreaterThan(0);
      expect(typeof p.publishedAt).toBe('string');
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof p.readingTimeMinutes).toBe('number');
      expect(p.readingTimeMinutes).toBeGreaterThan(0);
      expect(Array.isArray(p.tags)).toBe(true);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(Array.isArray(p.content)).toBe(true);
      expect(p.content.length).toBeGreaterThan(0);
    }
  });

  it('all slugs are unique', () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every content block has a valid type discriminator', () => {
    const validTypes = new Set([
      'paragraph',
      'heading',
      'code',
      'blockquote',
      'callout',
      'image',
      'list',
      'divider',
    ]);

    for (const post of blogPosts) {
      for (const block of post.content) {
        expect(validTypes.has(block.type)).toBe(true);
      }
    }
  });

  it('at most one post is featured', () => {
    const featured = blogPosts.filter((p) => p.featured);
    expect(featured.length).toBeLessThanOrEqual(1);
  });

  it('tags contain only lowercase kebab-case strings', () => {
    for (const post of blogPosts) {
      for (const tag of post.tags) {
        expect(tag).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    }
  });
});
