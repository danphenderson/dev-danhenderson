export type Tick = {
  date: string;
  route: string;
  grade: string;
  location: string;
  url: string;
};

export type SharedDataSourceKind = 'static' | 'remote' | 'cache' | 'build';

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
  featured?: boolean;
  location?: string;
  dateRange?: string;
  coordinates?: PhotoCoordinates;
};

export type TickRow = Tick & { id: string };
export type TodoRow = Todo & { id: string };

export type GradeBucket = {
  bucket: string;
  tickCount: number;
  todoCount: number;
};

export type LocationCount = {
  location: string;
  count: number;
};

export type ClimbingAnalytics = {
  overview: {
    tickCount: number;
    todoCount: number;
    uniqueLocations: number;
    mostRecentDate: string;
  };
  gradeProfile: GradeBucket[];
  destinationProfile: {
    topTickLocations: LocationCount[];
    topTodoLocations: LocationCount[];
  };
};

export type PhotographyAlbumMeta = {
  slug: string;
  name: string;
  photoCount: number;
  uniqueLocations: string[];
  location?: string;
  dateRange?: string;
};
