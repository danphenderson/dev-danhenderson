import { renderHook } from '@testing-library/react';
import { useDocumentMetadata } from '../../../src/hooks/useDocumentMetadata';

const getMetaContent = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(selector)?.content;

describe('useDocumentMetadata', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    window.history.replaceState({}, '', '/');
  });

  it('writes the canonical link and og:url from canonicalPath when provided', () => {
    renderHook(() =>
      useDocumentMetadata({
        title: 'CV | Daniel Henderson',
        description: 'Interactive CV',
        canonicalPath: '/cv',
      })
    );

    expect(document.title).toBe('CV | Daniel Henderson');
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost/cv'
    );
    expect(getMetaContent('meta[property="og:url"]')).toBe('http://localhost/cv');
  });

  it('falls back to the current route when canonicalPath is omitted', () => {
    window.history.replaceState({}, '', '/photography/landscape?view=grid#ignored-fragment');

    renderHook(() =>
      useDocumentMetadata({
        title: 'Landscape Photography | Daniel Henderson',
        description: 'Album detail page',
      })
    );

    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost/photography/landscape?view=grid'
    );
    expect(getMetaContent('meta[property="og:url"]')).toBe(
      'http://localhost/photography/landscape?view=grid'
    );
  });
});

describe('metadata navigation lifecycle', () => {
  it('clears obsolete image tags and resets article type on an imageless route', () => {
    const { rerender } = renderHook(
      ({ image, type }: { image?: string; type?: 'article' | 'website' }) =>
        useDocumentMetadata({ title: 'Route', description: 'Description', image, type }),
      { initialProps: { image: '/assets/old.jpg', type: 'article' } }
    );
    expect(getMetaContent('meta[property="og:image"]')).toContain('/assets/old.jpg');
    expect(getMetaContent('meta[property="og:type"]')).toBe('article');
    rerender({ image: undefined, type: undefined });
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.head.querySelector('meta[name="twitter:image"]')).toBeNull();
    expect(getMetaContent('meta[property="og:type"]')).toBe('website');
    expect(getMetaContent('meta[name="twitter:card"]')).toBe('summary');
  });
});
