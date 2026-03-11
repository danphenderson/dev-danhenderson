import type { CVSectionKey } from '../components/cv/cvSectionMetadata';

export type CVLayoutMode = 'mobile' | 'desktop';
export type CVSectionRegion = 'stack' | 'top' | 'sidebar' | 'main';

type CVLayoutPlacement<Region extends CVSectionRegion> = {
  region: Region;
  order: number;
};

type CVLayoutMotion = {
  delayMs: number;
  triggerOnView: boolean;
};

type CVSectionLayoutDefinition = {
  mobile: CVLayoutPlacement<'stack'> & CVLayoutMotion;
  desktop: CVLayoutPlacement<'top' | 'sidebar' | 'main'> & CVLayoutMotion;
};

export const cvPageSectionLayout: Record<CVSectionKey, CVSectionLayoutDefinition> = {
  about: {
    mobile: { region: 'stack', order: 0, delayMs: 0, triggerOnView: false },
    desktop: { region: 'top', order: 0, delayMs: 0, triggerOnView: false },
  },
  experience: {
    mobile: { region: 'stack', order: 1, delayMs: 0, triggerOnView: false },
    desktop: { region: 'main', order: 0, delayMs: 120, triggerOnView: true },
  },
  education: {
    mobile: { region: 'stack', order: 2, delayMs: 0, triggerOnView: true },
    desktop: { region: 'main', order: 1, delayMs: 240, triggerOnView: true },
  },
  volunteering: {
    mobile: { region: 'stack', order: 3, delayMs: 0, triggerOnView: true },
    desktop: { region: 'main', order: 2, delayMs: 360, triggerOnView: true },
  },
  github: {
    mobile: { region: 'stack', order: 4, delayMs: 0, triggerOnView: true },
    desktop: { region: 'sidebar', order: 0, delayMs: 120, triggerOnView: true },
  },
  certificates: {
    mobile: { region: 'stack', order: 5, delayMs: 0, triggerOnView: true },
    desktop: { region: 'sidebar', order: 1, delayMs: 240, triggerOnView: true },
  },
  tools: {
    mobile: { region: 'stack', order: 6, delayMs: 0, triggerOnView: true },
    desktop: { region: 'sidebar', order: 2, delayMs: 360, triggerOnView: true },
  },
  coding: {
    mobile: { region: 'stack', order: 7, delayMs: 0, triggerOnView: true },
    desktop: { region: 'main', order: 3, delayMs: 480, triggerOnView: true },
  },
};
