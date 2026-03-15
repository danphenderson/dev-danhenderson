export type Tick = {
  date: string;
  route: string;
  grade: string;
  location: string;
  url: string;
};

export type SharedDataSourceKind = 'static' | 'remote' | 'cache' | 'build';

export type SharedDataStatusReason =
  | 'bundled-content'
  | 'initial-fallback'
  | 'live-fetch'
  | 'cache-hit'
  | 'fallback-content'
  | 'partial-fallback'
  | 'network-error'
  | 'request-error';

export type SharedDataFreshness = {
  label: string;
  lastUpdated?: string;
  staleAfterMs?: number;
  isStale: boolean;
};

export type SharedDataSourceDetail = {
  id: string;
  label: string;
  ok: boolean;
};

export type SharedDataStatus = {
  source: SharedDataSourceKind;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  reason: SharedDataStatusReason;
  freshness: SharedDataFreshness;
  sourceDetail?: SharedDataSourceDetail[];
};

export type Todo = {
  route: string;
  grade: string;
  location: string;
  url: string;
};

export type PhotoCoordinates = {
  lat: number;
  lng: number;
};

export type PhotoItem = {
  img: string;
  title: string;
  rows?: number;
  cols?: number;
  location?: string;
  dateTaken?: string;
  tags?: string[];
  coordinates?: PhotoCoordinates;
};

export type PhotoCategory = {
  slug: string;
  name: string;
  description: string;
  src: string;
  album: PhotoItem[];
  location?: string;
  dateRange?: string;
  coordinates?: PhotoCoordinates;
};
