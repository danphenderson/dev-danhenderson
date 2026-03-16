export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3 | 4; text: string; id?: string }
  | { type: 'code'; language: string; code: string; filename?: string; caption?: string }
  | { type: 'blockquote'; text: string; attribution?: string }
  | { type: 'callout'; variant: 'note' | 'tip' | 'warning'; title?: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'divider' };

export type BlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  tags: string[];
  featured?: boolean;
  heroImage?: string;
  heroImageAlt?: string;
  content: BlogContentBlock[];
};

export type BlogPostMeta = Pick<
  BlogPost,
  | 'slug'
  | 'title'
  | 'subtitle'
  | 'excerpt'
  | 'author'
  | 'publishedAt'
  | 'readingTimeMinutes'
  | 'tags'
  | 'featured'
  | 'heroImage'
  | 'heroImageAlt'
>;
