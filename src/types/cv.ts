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
