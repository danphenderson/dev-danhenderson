import type { SxProps, Theme } from '@mui/material/styles';

export const cvSectionAnchorSx: SxProps<Theme> = {
  scrollMarginTop: {
    xs: 80,
    md: 96,
  },
};

export const cvSectionMetadata = {
  about: {
    id: 'cv-about',
    label: 'ABOUT',
  },
  experience: {
    id: 'cv-experience',
    label: 'EXPERIENCE',
  },
  education: {
    id: 'cv-education',
    label: 'EDUCATION',
  },
  volunteering: {
    id: 'cv-volunteering',
    label: 'VOLUNTEERING',
  },
  github: {
    id: 'cv-github',
    label: 'GITHUB',
  },
  certificates: {
    id: 'cv-certificates',
    label: 'CERTIFICATES',
  },
  tools: {
    id: 'cv-tools',
    label: 'STACK & TOOLS',
  },
  coding: {
    id: 'cv-coding',
    label: 'CODING EXAMPLES',
  },
} as const;

export type CVSectionKey = keyof typeof cvSectionMetadata;

export const cvProductivitySectionOrder: CVSectionKey[] = [
  'about',
  'experience',
  'education',
  'volunteering',
  'github',
  'certificates',
  'tools',
  'coding',
];
