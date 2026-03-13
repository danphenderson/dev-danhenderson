import type { SxProps, Theme } from '@mui/material/styles';

export const cvSectionViewportMetrics = {
  mobile: {
    anchorOffsetPx: 88,
    activeLinePx: 88,
  },
  desktop: {
    anchorOffsetPx: 112,
    activeLinePx: 112,
  },
} as const;

export const cvSectionAnchorSx: SxProps<Theme> = {
  scrollMarginTop: {
    xs: cvSectionViewportMetrics.mobile.anchorOffsetPx,
    md: cvSectionViewportMetrics.desktop.anchorOffsetPx,
  },
};

export const cvSectionMetadata = {
  about: {
    id: 'cv-about',
    label: 'ABOUT',
    navLabel: 'About',
  },
  experience: {
    id: 'cv-experience',
    label: 'EXPERIENCE',
    navLabel: 'Experience',
  },
  education: {
    id: 'cv-education',
    label: 'EDUCATION',
    navLabel: 'Education',
  },
  volunteering: {
    id: 'cv-volunteering',
    label: 'VOLUNTEERING',
    navLabel: 'Volunteering',
  },
  github: {
    id: 'cv-github',
    label: 'GITHUB',
    navLabel: 'GitHub',
  },
  certificates: {
    id: 'cv-certificates',
    label: 'CERTIFICATES',
    navLabel: 'Certificates',
  },
  tools: {
    id: 'cv-tools',
    label: 'STACK & TOOLS',
    navLabel: 'Tools',
  },
  coding: {
    id: 'cv-coding',
    label: 'CODING EXAMPLES',
    navLabel: 'Coding',
  },
} as const;

export type CVSectionKey = keyof typeof cvSectionMetadata;

export const cvSectionNavigationOrder: CVSectionKey[] = [
  'experience',
  'education',
  'volunteering',
  'github',
  'certificates',
  'tools',
  'coding',
];
