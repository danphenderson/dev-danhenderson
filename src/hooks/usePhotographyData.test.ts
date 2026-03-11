import { renderHook } from '@testing-library/react';
import { usePhotographyData } from './usePhotographyData';
import { photographyCategories as mockCategories } from '../data/photography';

jest.mock('../data/photography', () => ({
  photographyCategories: [
    {
      slug: 'landscape',
      name: 'Landscape',
      description: 'Mountain views',
      src: '/assets/landscape.jpg',
      album: [{ img: '/assets/photo1.jpg', title: 'Summit', rows: 2, cols: 2 }],
    },
    {
      slug: 'action',
      name: 'Action',
      description: 'Climbing shots',
      src: '/assets/action.jpg',
      album: [{ img: '/assets/photo2.jpg', title: 'Send' }],
    },
  ],
}));

describe('usePhotographyData', () => {
  it('returns the photography categories from the data module', () => {
    const { result } = renderHook(() => usePhotographyData());

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.categories).toHaveLength(2);
  });

  it('returns categories with expected shape', () => {
    const { result } = renderHook(() => usePhotographyData());

    result.current.categories.forEach((category) => {
      expect(category).toHaveProperty('slug');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('src');
      expect(category).toHaveProperty('album');
      expect(Array.isArray(category.album)).toBe(true);
    });
  });

  it('returns stable reference across re-renders', () => {
    const { result, rerender } = renderHook(() => usePhotographyData());
    const firstCategories = result.current.categories;

    rerender();

    expect(result.current.categories).toBe(firstCategories);
  });
});
