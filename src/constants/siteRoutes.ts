import { cvBackgroundImage } from '../data/cv';
import { fallbackBackgroundImage } from '../data/photography';
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
  },
};

export const siteRoutes = Object.values(siteRouteMap);

export const primaryNavigationRoutes = siteRoutes.filter((route) => route.showInPrimaryNav);
