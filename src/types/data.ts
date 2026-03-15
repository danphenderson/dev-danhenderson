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

export type SharedDataStatus = {
  source: SharedDataSourceKind;
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  reason: SharedDataStatusReason;
  freshness: SharedDataFreshness;
};

export type Todo = {
  route: string;
  grade: string;
  location: string;
  url: string;
};

export type PhotoItem = {
  img: string;
  title: string;
  rows?: number;
  cols?: number;
};

export type PhotoCategory = {
  slug: string;
  name: string;
  description: string;
  src: string;
  album: PhotoItem[];
};
