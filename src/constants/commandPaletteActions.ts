import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
  type CVSectionKey,
} from '../components/cv/cvSectionMetadata';
import { photographyCategories } from '../data/photography';
import { sharedRouteActions, type SharedRouteAction } from './routeActions';
import { siteRouteMap } from './siteRoutes';

export type CommandPaletteAction = Omit<SharedRouteAction, 'recoveryPriority' | 'routeId'>;

const primaryRouteActions: CommandPaletteAction[] = sharedRouteActions.map(
  ({ recoveryPriority: _recoveryPriority, ...action }) => action
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
}));

const photographyAlbumActions: CommandPaletteAction[] = photographyCategories.map((category) => ({
  id: `photo-album-${category.slug}`,
  label: `Album: ${category.name}`,
  description: `Open the ${category.name.toLowerCase()} photography album.`,
  path: `${siteRouteMap.photography.path}/${category.slug}`,
  keywords: ['album', 'photography', category.slug, category.name.toLowerCase()],
}));

export const commandPaletteActions: CommandPaletteAction[] = [
  ...primaryRouteActions,
  ...cvSectionActions,
  ...photographyAlbumActions,
];
