import type { SharedDataStatus } from './data';

export type AboutMe = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  opportunities?: string[];
  bioLink?: {
    text: string;
    url: string;
    tooltip?: string;
  };
};

export type CodingExample = {
  title: string;
  description: string;
  links: string[];
  tabs?: CodingExampleTab[];
};

export type CodingExampleTab =
  | {
      value: string;
      label: string;
      kind: 'list';
      items: string[];
    }
  | {
      value: string;
      label: string;
      kind: 'skills';
      skills: string[];
    };

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  link?: string;
};

export type ExperienceProjectSegment = {
  text: string;
  link?: string;
  tooltip?: string;
  lineBreakBefore?: boolean;
};
export type ExperienceDescription = string | ExperienceProjectSegment[];
export type ExperienceProject = string | ExperienceProjectSegment | ExperienceProjectSegment[];

export type Experience = {
  company: string;
  companyUrl?: string;
  companyTooltip?: string;
  industry?: string;
  title: string;
  startDate: string;
  endDate: string;
  impactHighlights?: string[];
  description?: ExperienceDescription;
  projects?: ExperienceProject[];
  skills?: string[];
};

export type EducationInfo = {
  entries: EducationEntry[];
};

export type EducationGpaEntry = {
  label: string;
  value: string;
};

export type EducationEntry = {
  university: string;
  program: string;
  summary: string;
  dateRange?: string;
  gpa?: EducationGpaEntry[];
  minor?: string;
  expectedCompletion?: string;
  highlights?: string[];
  skills?: string[];
};

export type VolunteeringEntry = {
  organization: string;
  organizationUrl?: string;
  organizationTooltip?: string;
  role: string;
  summary: string;
  dateRange: string;
  location?: string;
  highlights: string[];
};

export type GitHubActivityItem = { label: string; href?: string };
export type GitHubContribution = { name: string; url: string; stars?: number };

/**
 * Keys corresponding to CV section anchors in cvSectionMetadata.
 * Maintained as a plain union to avoid a circular import from components.
 */
export type CVSectionKey =
  | 'about'
  | 'experience'
  | 'education'
  | 'volunteering'
  | 'github'
  | 'certificates'
  | 'coding';

export type CVStoryContactChannel = {
  label: string;
  url: string;
  icon: 'email' | 'github' | 'linkedin' | 'web';
};

export type CVStoryEndData = {
  headline: string;
  body: string;
  channels: CVStoryContactChannel[];
};

export type CVStoryItem =
  | { kind: 'about'; data: AboutMe }
  | { kind: 'experience'; data: Experience; sortDate: Date }
  | { kind: 'education'; data: EducationEntry; sortDate: Date }
  | { kind: 'certificate'; data: Certificate; sortDate: Date }
  | { kind: 'volunteering'; data: VolunteeringEntry; sortDate: Date }
  | { kind: 'coding'; data: CodingExample }
  | { kind: 'end'; data: CVStoryEndData };

export type GitHubProfileData = {
  activity: GitHubActivityItem[];
  contributions: GitHubContribution[];
  encounteredError: boolean;
  status: SharedDataStatus;
};
