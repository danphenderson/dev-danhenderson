import type { SxProps, Theme } from '@mui/material/styles';

export const cvSectionAnchorSx: SxProps<Theme> = {
  scrollMarginTop: {
    xs: 80,
    md: 152,
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
  'about',
  'experience',
  'education',
  'volunteering',
  'github',
  'certificates',
  'tools',
  'coding',
];
