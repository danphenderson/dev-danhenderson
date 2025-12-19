export const assetBasePath = process.env.PUBLIC_URL || '';

export const avatar = `${assetBasePath}/assets/home.jpg`;
export const cvBackgroundImage = `${assetBasePath}/assets/photography/landscape/landscape-tieton-south-fork-3.jpg`;

export const githubUsername = 'danphenderson';
export const githubProfileUrl = 'https://github.com/danphenderson';
export const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/';

export type AboutMe = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export type CodingExample = {
  title: string;
  description: string;
  links: string[];
};

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  link?: string;
};

export type ExperienceProject = string | { text: string; link?: string };

export type Experience = {
  company: string;
  companyUrl?: string;
  industry?: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  projects?: ExperienceProject[];
};

export type EducationInfo = {
  university: string;
  degree: string;
  grades: string;
  activities: string;
  achievements: string;
};

export type StackSection = {
  title: string;
  items: string[];
};

export type GitHubActivityItem = { label: string; href?: string };
export type GitHubContribution = { name: string; url: string; stars?: number };
export type GitHubProject = { name: string; url: string };

export const aboutMe: AboutMe = {
  name: 'Daniel Henderson',
  title: 'Software Engineer',
  email: 'me@danhenderson.dev',
  phone: '906-281-7641',
  location: 'Seattle, WA',
  bio: `Applied/Computational Math PhD student (M.S. expected Spring 2026) focused on performance-critical scientific software and data systems.

Ex–Lucerna Health data scientist/pipeline engineer: built cloud-native ingestion + analytics infrastructure that boosted throughput 50%+ and reduced compute costs.

Research: numerical methods for differential equations in hemodynamics; additional work in smooth optimization and benchmarking across Julia, Python, and C.

Interested in applied roles at the intersection of math, systems, and production software (scientific computing, data platforms, ML/AI engineering). Full profile on LinkedIn.`,
};

export const codingExamples: CodingExample[] = [
  {
    title: 'chromex',
    description: "An asynchronous interface for chrome browser automation's and scrapping that is built on bs4 and selenium.",
    links: ['https://github.com/danphenderson/python-chromex'],
  },
  {
    title: 'Portfolio',
    description: 'My personal portfolio website built with React-TypeScript, using Material UI 5. It is deployed on AWS using S3, CloudFront, and Route53.',
    links: ['https://danhenderson.dev'],
  },
  {
    title: 'BlockOpt.jl',
    description: 'An optim-style interface built on top of ForwardDiff.jl and TRS.jl Julia packages exploring a novel scheme for an unconstrained Quasi-Newton minimization of a smooth objective function.',
    links: ['https://github.com/danphenderson/BlockOpt.jl'],
  },
  {
    title: 'UncNLPrograms.jl',
    description: 'A library containing a subset of high-dimensional, nonlinear, and unconstrained optimization problems from the CUTEst set implemented in native Julia to test solvers using Automatic/Algorithmic Differentiation.',
    links: ['https://github.com/danphenderson/UncNLPrograms.jl'],
  },
  {
    title: 'MasterPlan',
    description: 'A java application that allows users to create and manage a DAG structure of tasks and corresponding subtasks. It was built using Maven, Java11, and JavaFX.',
    links: ['https://github.com/danphenderson/masterplan-app'],
  },
  {
    title: 'LeetCode Solutions',
    description: 'A collection of my solutions to LeetCode problems.',
    links: ['https://github.com/danphenderson/leetcode-solutions'],
  },
];

export const certificates: Certificate[] = [
  {
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    date: 'Feburary 5th, 2024',
    link: `${assetBasePath}/assets/aws-soln-architect-cert.pdf`,
  },
  {
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'January 19th, 2024',
    link: `${assetBasePath}/assets/aws-cloud-practitioner-cert.pdf`,
  },
];

export const experiences: Experience[] = [
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer | Full Time',
    startDate: 'Apr 2022',
    endDate: 'Dec 2022 (9 mos)',
    description: 'Cloud-native data platform engineering for ingestion, entity resolution, and batch ETL across AWS.',
    projects: [
      'Developed and operated cloud-native ingestion + entity-resolution pipelines powering large-scale analytics; improved end-to-end data-volume throughput by 50%+ and reduced compute cost.',
      'Automated integrity checks and admin workflows across PostgreSQL, Glue Catalog, S3, and Redshift, reducing manual operational load.',
      'Modernized batch ETL with Glue 3.0 and EMR transient clusters (instance fleets), lowering compute spend and improving reliability.',
      'Designed and built a reusable AWS CDK infrastructure library adopted by all tenant applications, enforcing standardized patterns in a multi-tenant AWS environment.',
      'Migrated shared ETL/infrastructure from Bitbucket to GitHub Enterprise and standardized CI/CD workflows.',
    ],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'Nov 2021',
    endDate: 'Apr 2022 (6 mos)',
    description: 'Built and operated production ML workflows on AWS with versioned releases and automated deployments via CDK and CI/CD.',
    projects: [
      'Built and operated production ML workflows on AWS with versioned releases and automated deployments via CDK + CI/CD.',
      'Implemented a scalable PySpark isolation-forest anomaly detection service over a multi-tenant S3 data lake.',
      'Designed shared ML abstractions encapsulating security + infrastructure concerns to make model workflows portable and production-ready.',
      'Delivered governed analytics services aligned with HiTrust requirements and internal compliance controls.',
    ],
  },
  {
    company: 'Michigan Technological University',
    industry: 'Higher Education',
    title: 'Researcher | Internship',
    startDate: 'May 2021',
    endDate: 'Nov 2021 (6 mos)',
    description: 'Co-authored and implemented numerical experiments for Quasi-Newton Optimization with Hessian Samples.',
    projects: [
      '2022, Azzam J, Henderson D, Ong BW, and Struthers AA, Quasi-Newton Optimization with Hessian Samples',
      'Built BlockOpt.jl (trust-region quasi-Newton with forward-mode AD) and implemented solvers for quadratically constrained subproblems.',
      'Created UncNLPrograms.jl to translate CUTEst problems for reproducible AD-based benchmarking.',
      { text: 'Article:', link: 'https://lnkd.in/gfP39wZX' },
      { text: 'Zenodo DOI:', link: 'https://zenodo.org/record/5826808#.Y_QyR-zMJzW' },
      { text: 'Documentation:', link: 'https://danphenderson.github.io/BlockOpt.jl/dev/' },
      { text: 'Repository (BlockOpt.jl):', link: 'https://github.com/danphenderson/BlockOpt.jl' },
      { text: 'Repository (UncNLPrograms.jl):', link: 'https://github.com/danphenderson/UncNLPrograms.jl' },
    ],
  },
  {
    company: 'Michigan Technological University',
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'September 2015',
    endDate: 'May 2018 (3 yrs 5 mos)',
    description: 'Provided weekly tutoring services to NCAA student-athletes in multivariable, integral and differential calculus, ordinary differential equations, and linear algebra.',
    projects: [],
  },
];

export const educationInfo: EducationInfo = {
  university: 'Michigan Technological University',
  degree: 'B.S. Cum Laude, Mathematics, Applied/Computational & Minor in Computer Science',
  grades: 'Cumulative: 3.56 | Departmental: 3.71',
  activities:
    "- President & V.P., Finance Club\n" +
    "- Representative, Undergraduate Student Government\n" +
    "- Member, Ways and Means Committee, allocating $700K to 200+ student organizations\n" +
    "- Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K\n" +
    "- Student Advisor to the Dean of the School of Business and Economics\n" +
    "- Junior Partner, Applied Portfolio Management Program",
  achievements:
    "Recipient of Dean's List award for six semesters (Spring 2015, Summer 2015, Fall 2019, Spring 2020, Fall 2020, & Spring 2021)\n" +
    "Certificate of Merit for Outstanding Academic Achievement in Calculus II with Technology, Mathematical Sciences Department",
};

export const stackAndTools: StackSection[] = [
  {
    title: 'Stack',
    items: [
      'Building on macOS using Z-Shell',
      'Homebrew package manager',
      'Vim editor',
      'Visual Studio Code IDE',
    ],
  },
  {
    title: 'Languages',
    items: [
      'Python',
      'Java',
      'Julia',
      'C/C++',
      'SQL',
      'Zsh',
      'Bash',
      'LaTeX',
      'HTML',
      'TypeScript',
    ],
  },
  {
    title: 'Tools',
    items: [
      'docker/docker-compose',
      'pre-commit',
      'cookiecutter',
      'git submodule',
      'jq',
      'gh',
    ],
  },
  {
    title: 'Frameworks',
    items: ['DBT', 'Django', 'FastAPI', 'React', 'Apache Spark', 'Amazon CDK & SDK'],
  },
  {
    title: 'Databases',
    items: ['Redshift', 'PostgreSQL'],
  },
  {
    title: 'Services',
    items: [
      'Amazon Management Console',
      'Sentry',
      'SonarCloud',
      'Slack',
      'GitHub',
      'Notion',
      'GitBook',
      'Bitbucket',
      'Jira',
      'Confluence',
      'Lucid',
      'OpenAPI/Swagger',
      'Docker',
      'Jupyter',
      'DBeaver',
      'Spark UI',
    ],
  },
];

export const fallbackGitHubActivity: GitHubActivityItem[] = [
  { label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).', href: 'https://github.com/danphenderson/BlockOpt.jl' },
  { label: 'Experimenting with data/ML pipelines on AWS Glue, EMR, and CDK.', href: 'https://github.com/danphenderson' },
  { label: 'Shipping personal portfolio + CV site (React, TypeScript, AWS).', href: 'https://github.com/danphenderson/dev-danhenderson' },
];

export const fallbackGitHubProjects: GitHubProject[] = [
  { name: 'BlockOpt.jl', url: 'https://github.com/danphenderson/BlockOpt.jl' },
  { name: 'UncNLPrograms.jl', url: 'https://github.com/danphenderson/UncNLPrograms.jl' },
  { name: 'python-chromex', url: 'https://github.com/danphenderson/python-chromex' },
  { name: 'masterplan-app', url: 'https://github.com/danphenderson/masterplan-app' },
];

export const MAX_VISIBLE_CONTRIBUTIONS = 20;
