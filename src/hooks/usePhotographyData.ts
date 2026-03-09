import { useMemo } from 'react';
import { photographyCategories } from '../data/photography';

export function usePhotographyData() {
  const categories = useMemo(() => photographyCategories, []);

  return { categories };
}
