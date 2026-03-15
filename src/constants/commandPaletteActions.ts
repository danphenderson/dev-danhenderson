import {
  cvSectionMetadata,
  cvSectionNavigationOrder,
  type CVSectionKey,
} from '../components/cv/cvSectionMetadata';
import { photographyCategories } from '../data/photography';
import { primaryNavigationRoutes, siteRouteMap } from './siteRoutes';

export type CommandPaletteAction = {
  id: string;
  label: string;
  description: string;
  path: string;
  keywords: string[];
};

const primaryRouteActionMetadata = {
  home: {
    description: 'Return to the home hero route.',
    keywords: ['start', 'landing'],
  },
  cv: {
    description: 'Open the interactive CV and GitHub-driven profile sections.',
    keywords: ['resume', 'experience'],
  },
  climbing: {
    description: 'Open climbing ticks, goals, and analytics.',
    keywords: ['routes', 'analytics'],
  },
  photography: {
    description: 'Browse photography albums and route-specific galleries.',
    keywords: ['gallery', 'photos'],
  },
} as const;

type CommandPaletteRouteId = keyof typeof primaryRouteActionMetadata;

const commandPaletteRoutes = [
  siteRouteMap.home,
  ...primaryNavigationRoutes,
] as (typeof siteRouteMap)[CommandPaletteRouteId][];

const primaryRouteActions: CommandPaletteAction[] = commandPaletteRoutes.map((route) => {
  const routeId = route.id as CommandPaletteRouteId;

  return {
    id: `route-${routeId}`,
    label: route.label,
    description: primaryRouteActionMetadata[routeId].description,
    path: route.path,
    keywords: [...primaryRouteActionMetadata[routeId].keywords, ...route.keywords],
  };
});

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
