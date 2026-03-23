import { renderHook } from '@testing-library/react';
import { useBlogData } from '../../../src/hooks/useBlogData';

jest.mock('../../../src/data/blog', () => ({
  blogPosts: [
    {
      slug: 'first-post',
      title: 'First Post',
      excerpt: 'Excerpt one',
      author: 'Dan Henderson',
      publishedAt: '2025-01-15',
      readingTimeMinutes: 5,
      tags: ['react', 'typescript'],
      featured: true,
      heroImage: '/assets/hero1.jpg',
      heroImageAlt: 'Hero one',
      content: [{ type: 'paragraph', text: 'Hello world' }],
    },
    {
      slug: 'second-post',
      title: 'Second Post',
      excerpt: 'Excerpt two',
      author: 'Dan Henderson',
      publishedAt: '2025-02-10',
      readingTimeMinutes: 8,
      tags: ['react', 'performance'],
      content: [{ type: 'paragraph', text: 'Performance tips' }],
    },
    {
      slug: 'third-post',
      title: 'Third Post',
      excerpt: 'Excerpt three',
      author: 'Dan Henderson',
      publishedAt: '2025-03-01',
      readingTimeMinutes: 4,
      tags: ['typescript'],
      content: [{ type: 'paragraph', text: 'TS patterns' }],
    },
  ],
}));

describe('useBlogData', () => {
  it('returns posts sorted by publishedAt descending', () => {
    const { result } = renderHook(() => useBlogData());
    const slugs = result.current.posts.map((p) => p.slug);

    expect(slugs).toEqual(['third-post', 'second-post', 'first-post']);
  });

  it('returns the featured post', () => {
    const { result } = renderHook(() => useBlogData());

    expect(result.current.featuredPost?.slug).toBe('first-post');
  });

  it('returns tags with counts sorted by frequency', () => {
    const { result } = renderHook(() => useBlogData());

    expect(result.current.tags).toEqual([
      { tag: 'react', count: 2 },
      { tag: 'typescript', count: 2 },
      { tag: 'performance', count: 1 },
    ]);
  });

  it('looks up a post by slug', () => {
    const { result } = renderHook(() => useBlogData());

    expect(result.current.getPostBySlug('second-post')?.title).toBe('Second Post');
    expect(result.current.getPostBySlug('nonexistent')).toBeUndefined();
  });

  it('returns related posts by shared tags', () => {
    const { result } = renderHook(() => useBlogData());
    const related = result.current.getRelatedPosts('first-post');

    expect(related.length).toBeGreaterThan(0);
    expect(related[0].slug).not.toBe('first-post');
  });

  it('returns adjacent posts for navigation', () => {
    const { result } = renderHook(() => useBlogData());
    // sorted order: third, second, first
    const adj = result.current.getAdjacentPosts('second-post');

    expect(adj.prev?.slug).toBe('third-post');
    expect(adj.next?.slug).toBe('first-post');
  });

  it('returns no prev for first post in list', () => {
    const { result } = renderHook(() => useBlogData());
    const adj = result.current.getAdjacentPosts('third-post');

    expect(adj.prev).toBeUndefined();
    expect(adj.next?.slug).toBe('second-post');
  });

  it('does not expose async status metadata for bundled blog content', () => {
    const { result } = renderHook(() => useBlogData());

    expect(result.current).not.toHaveProperty('status');
  });

  it('returns stable references across re-renders', () => {
    const { result, rerender } = renderHook(() => useBlogData());
    const first = result.current.posts;
    rerender();
    expect(result.current.posts).toBe(first);
  });
});
