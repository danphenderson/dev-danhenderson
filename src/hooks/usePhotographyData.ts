import { useMemo } from 'react';
import { photographyCategories } from '../data/photography';
import type { PhotoCategory, PhotographyAlbumMeta } from '../types/data';

function deriveAlbumMeta(category: PhotoCategory): PhotographyAlbumMeta {
  const locationSet = new Set<string>();
  for (const photo of category.album) {
    if (photo.location) {
      locationSet.add(photo.location);
    }
  }

  return {
    slug: category.slug,
    name: category.name,
    photoCount: category.album.length,
    uniqueLocations: Array.from(locationSet),
    location: category.location,
    dateRange: category.dateRange,
  };
}

export function usePhotographyData() {
  const albumMeta = useMemo(() => photographyCategories.map(deriveAlbumMeta), []);

  const totalPhotos = useMemo(
    () => photographyCategories.reduce((sum, cat) => sum + cat.album.length, 0),
    []
  );

  const featuredCategory = useMemo(
    () => photographyCategories.find((c) => c.featured) ?? photographyCategories[0],
    []
  );

  return { categories: photographyCategories, featuredCategory, albumMeta, totalPhotos };
}
