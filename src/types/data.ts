export type Tick = {
  date: string;
  route: string;
  grade: string;
  location: string;
  url: string;
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
  name: string;
  description: string;
  src: string;
  album: PhotoItem[];
};
