import { cvSectionMetadata, cvSectionNavigationOrder } from '../components/cv/cvSectionMetadata';
import { photographyCategories } from '../data/photography';
import { siteRouteMap } from './siteRoutes';

export type CommandPaletteAction = {
  id: string;
  label: string;
  description: string;
  path: string;
  keywords: string[];
};

const primaryRouteActions: CommandPaletteAction[] = [
  {
    id: 'route-home',
    label: siteRouteMap.home.label,
    description: 'Return to the home hero route.',
    path: siteRouteMap.home.path,
    keywords: ['start', 'landing', ...siteRouteMap.home.keywords],
  },
  {
    id: 'route-cv',
    label: siteRouteMap.cv.label,
    description: 'Open the interactive CV and GitHub-driven profile sections.',
    path: siteRouteMap.cv.path,
    keywords: ['resume', 'experience', ...siteRouteMap.cv.keywords],
  },
  {
    id: 'route-climbing',
    label: siteRouteMap.climbing.label,
    description: 'Open climbing ticks, goals, and analytics.',
    path: siteRouteMap.climbing.path,
    keywords: ['routes', 'analytics', ...siteRouteMap.climbing.keywords],
  },
  {
    id: 'route-photography',
    label: siteRouteMap.photography.label,
    description: 'Browse photography albums and route-specific galleries.',
    path: siteRouteMap.photography.path,
    keywords: ['gallery', 'photos', ...siteRouteMap.photography.keywords],
  },
];

const cvSectionActions: CommandPaletteAction[] = cvSectionNavigationOrder.map((sectionKey) => ({
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
