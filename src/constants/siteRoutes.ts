import { cvBackgroundImage } from '../data/cv';
import { fallbackBackgroundImage } from '../data/photography';
import type { SharedDataSourceKind } from '../types/data';
import { resolvePublicAssetPath } from '../utils/assets';

export type SiteRouteId = 'home' | 'cv' | 'climbing' | 'photography' | 'not-found';

export type SiteRouteDefinition = {
  id: SiteRouteId;
  label: string;
  path: string;
  title: string;
  description: string;
  image: string;
  keywords: string[];
  showInPrimaryNav?: boolean;
  action?: {
    description: string;
    keywords: string[];
    includeInCommandPalette?: boolean;
    recoveryPriority: number;
  };
  status?: {
    source: SharedDataSourceKind;
    label: string;
  };
};

const homeImage = resolvePublicAssetPath('/assets/home.jpg');
const climbingImage = resolvePublicAssetPath('/assets/climbing/climbing-locations.png');

export const siteRouteMap: Record<SiteRouteId, SiteRouteDefinition> = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    title: 'Daniel Henderson | Software Engineer, Data Scientist, and Mathematician',
    description:
      'Portfolio site for Daniel Henderson featuring software engineering, scientific computing, climbing, and photography.',
    image: homeImage,
    keywords: ['home', 'portfolio', 'software engineer', 'mathematics', 'photography'],
    action: {
      description: 'Return to the home hero route.',
      keywords: ['start', 'landing'],
      recoveryPriority: 1,
    },
    status: {
      source: 'static',
      label: 'Static route shell and portfolio overview content.',
    },
  },
  cv: {
    id: 'cv',
    label: 'CV',
    path: '/cv',
    title: 'CV | Daniel Henderson',
    description:
      "Interactive CV covering Daniel Henderson's engineering experience, education, GitHub activity, and technical projects.",
    image: cvBackgroundImage,
    keywords: ['cv', 'resume', 'experience', 'github', 'projects'],
    showInPrimaryNav: true,
    action: {
      description: 'Open the interactive CV and GitHub-driven profile sections.',
      keywords: ['resume', 'experience'],
      recoveryPriority: 2,
    },
    status: {
      source: 'remote',
      label: 'Static CV content with live GitHub enrichment and fallback support.',
    },
  },
  climbing: {
    id: 'climbing',
    label: 'Climbing',
    path: '/climbing',
    title: 'Climbing Log | Daniel Henderson',
    description:
      'Climbing ticks and route goals collected from Mountain Project, organized by date, grade, and location.',
    image: climbingImage,
    keywords: ['climbing', 'ticks', 'routes', 'mountain project'],
    showInPrimaryNav: true,
    action: {
      description: 'Open climbing ticks, goals, and analytics.',
      keywords: ['routes', 'analytics'],
      recoveryPriority: 3,
    },
    status: {
      source: 'static',
      label: 'Bundled climbing datasets transformed client-side for filtering and analytics.',
    },
  },
  photography: {
    id: 'photography',
    label: 'Photography',
    path: '/photography',
    title: 'Photography | Daniel Henderson',
    description:
      'Photography albums featuring landscape, action, and field work imagery across climbing trips and outdoor adventures.',
    image: resolvePublicAssetPath(fallbackBackgroundImage),
    keywords: ['photography', 'albums', 'landscape', 'action'],
    showInPrimaryNav: true,
    action: {
      description: 'Browse photography albums and route-specific galleries.',
      keywords: ['gallery', 'photos'],
      recoveryPriority: 4,
    },
    status: {
      source: 'static',
      label: 'Bundled gallery metadata and static image assets.',
    },
  },
  'not-found': {
    id: 'not-found',
    label: 'Not Found',
    path: '*',
    title: 'Page Not Found | Daniel Henderson',
    description:
      "The requested page could not be found. Use the site navigation to continue exploring Daniel Henderson's portfolio.",
    image: resolvePublicAssetPath(fallbackBackgroundImage),
    keywords: ['404', 'not found'],
    status: {
      source: 'static',
      label: 'Static recovery route for unmatched paths.',
    },
  },
};

export const siteRoutes = Object.values(siteRouteMap);

export const primaryNavigationRoutes = siteRoutes.filter((route) => route.showInPrimaryNav);
