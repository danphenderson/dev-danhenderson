import { useMemo } from 'react';
import { photographyCategories } from '../data/photography';
import type { PhotoCategory } from '../types/data';

export type PhotoCategoryWithSlug = PhotoCategory & { slug: string };

export function usePhotographyData() {
  const categories = useMemo<PhotoCategoryWithSlug[]>(() => {
    return photographyCategories.map((category) => ({
      ...category,
      slug: category.name.toLowerCase(),
    }));
  }, []);

  return { categories };
}
