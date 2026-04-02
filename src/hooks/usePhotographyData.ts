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

const categories = photographyCategories;

const albumMeta = categories.map(deriveAlbumMeta);

const totalPhotos = categories.reduce((sum, category) => sum + category.album.length, 0);

const featuredCategory = categories.find((category) => category.featured) ?? categories[0];

const photographyData = {
  categories,
  featuredCategory,
  albumMeta,
  totalPhotos,
};

export function usePhotographyData() {
  return photographyData;
}
