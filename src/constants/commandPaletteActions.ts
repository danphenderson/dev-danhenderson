import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
  type CVSectionKey,
} from '../components/cv/cvSectionMetadata';
import { photographyCategories } from '../data/photography';
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

const photographyAlbumActions: CommandPaletteAction[] = photographyCategories.map((category) => ({
  id: `photo-album-${category.slug}`,
  label: `Album: ${category.name}`,
  description: `Open the ${category.name.toLowerCase()} photography album.`,
  path: `${siteRouteMap.photography.path}/${category.slug}`,
  keywords: ['album', 'photography', category.slug, category.name.toLowerCase()],
  kind: 'photography-album',
  routeId: 'photography',
}));

export const commandPaletteActions: CommandPaletteAction[] = [
  ...primaryRouteActions,
  ...cvSectionActions,
  ...photographyAlbumActions,
];
