import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
  type CVSectionKey,
} from '../components/cv/cvSectionMetadata';
import { blogPosts } from '../data/blog';
import { photographyCategories } from '../data/photography';
import { isFeatureEnabled } from './featureFlags';
import { sharedRouteActions } from './routeActions';
import { siteRouteMap, type SiteRouteId } from './siteRoutes';

export type CommandPaletteActionKind = 'route' | 'cv-section' | 'photography-album';

export type CommandPaletteAction = {
  id: string;
  label: string;
  description: string;
  path: string;
  keywords: string[];
  kind: CommandPaletteActionKind;
  routeId: SiteRouteId;
};

const primaryRouteActions: CommandPaletteAction[] = sharedRouteActions.map(
  ({ recoveryPriority: _recoveryPriority, ...action }) => ({
    ...action,
    kind: 'route',
  })
);

const cvCommandPaletteSectionOrder: CVSectionKey[] = ['about', ...cvSectionNavigationOrder];

const cvSectionActions: CommandPaletteAction[] = cvCommandPaletteSectionOrder.map((sectionKey) => ({
  id: `cv-section-${sectionKey}`,
  label: `CV: ${cvSectionMetadata[sectionKey].navLabel}`,
  description: `Jump to the ${cvSectionMetadata[
    sectionKey
  ].navLabel.toLowerCase()} section on the CV route.`,
  path: `${siteRouteMap.cv.path}#${cvSectionMetadata[sectionKey].id}`,
  keywords: ['cv', 'section', cvSectionMetadata[sectionKey].navLabel.toLowerCase()],
  kind: 'cv-section',
  routeId: 'cv',
}));

const cvStoryModeAction: CommandPaletteAction = {
  id: 'cv-story-mode',
  label: 'CV: Story Mode',
  description: 'View a guided narrative walk through the CV.',
  path: `${siteRouteMap.cv.path}?mode=story`,
  keywords: ['cv', 'story', 'narrative', 'guided'],
  kind: 'route',
  routeId: 'cv',
};

const photographyAlbumActions: CommandPaletteAction[] = photographyCategories.map((category) => {
  const locationKeywords: string[] = [];
  if (category.location) {
    locationKeywords.push(category.location.toLowerCase());
  }
  const photoLocationSet = new Set<string>();
  for (const photo of category.album) {
    if (photo.location) {
      photoLocationSet.add(photo.location.toLowerCase());
    }
  }
  locationKeywords.push(...Array.from(photoLocationSet));

  const tagSet = new Set<string>();
  for (const photo of category.album) {
    if (photo.tags) {
      for (const tag of photo.tags) {
        tagSet.add(tag.toLowerCase());
      }
    }
  }

  return {
    id: `photo-album-${category.slug}`,
    label: `Album: ${category.name}`,
    description: `Open the ${category.name.toLowerCase()} photography album.${
      category.location ? ` ${category.location}.` : ''
    }${category.album.length ? ` ${category.album.length} photos.` : ''}`,
    path: `${siteRouteMap.photography.path}/${category.slug}`,
    keywords: [
      'album',
      'photography',
      category.slug,
      category.name.toLowerCase(),
      ...locationKeywords,
      ...Array.from(tagSet),
    ],
    kind: 'photography-album',
    routeId: 'photography',
  };
});

export type CommandPaletteActionKindExtended = CommandPaletteActionKind | 'blog-post';

const blogPostActions: CommandPaletteAction[] = blogPosts.map((post) => ({
  id: `blog-post-${post.slug}`,
  label: `Blog: ${post.title}`,
  description: post.excerpt.slice(0, 120) + (post.excerpt.length > 120 ? '…' : ''),
  path: `${siteRouteMap.blog.path}/${post.slug}`,
  keywords: ['blog', 'article', 'post', post.slug, post.title.toLowerCase(), ...post.tags],
  kind: 'route' as CommandPaletteActionKind,
  routeId: 'blog' as SiteRouteId,
}));

const enabledBlogPostActions = isFeatureEnabled('blog') ? blogPostActions : [];

export const commandPaletteActions: CommandPaletteAction[] = [
  ...primaryRouteActions,
  cvStoryModeAction,
  ...cvSectionActions,
  ...photographyAlbumActions,
  ...enabledBlogPostActions,
];
