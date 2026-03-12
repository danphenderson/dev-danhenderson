import { photographyCategories } from '../data/photography';

export function usePhotographyData() {
  return { categories: photographyCategories };
}
