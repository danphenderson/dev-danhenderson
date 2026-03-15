import { photographyCategories } from '../data/photography';
import type { SharedDataStatus } from '../types/data';

export function usePhotographyData() {
  const status: SharedDataStatus = {
    source: 'static',
    loading: false,
    error: null,
    isFallback: false,
    reason: 'bundled-content',
    freshness: {
      label:
        'Bundled photography album metadata and static image assets are available in the client build.',
      isStale: false,
    },
  };

  return { categories: photographyCategories, status };
}
