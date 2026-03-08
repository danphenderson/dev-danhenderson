export const assetBasePath = process.env.PUBLIC_URL || '';

export const avatar = `${assetBasePath}/assets/home.jpg`;
export const cvBackgroundImage = `${assetBasePath}/assets/photography/landscape/landscape-tieton-south-fork-3.jpg`;
export const resumePdfUrl = `${assetBasePath}/assets/daniel-henderson-resume.pdf`;
export const resumeDownloadFilename = 'Daniel-Henderson-Resume.pdf';

export const githubUsername = 'danphenderson';
export const githubProfileUrl = 'https://github.com/danphenderson';
export const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/';
const mtuMathGraduateUrl = 'https://www.mtu.edu/math/graduate/students/';

export type AboutMe = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  bioLink?: {
    text: string;
    url: string;
  };
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
  impactHighlights?: string[];
  description?: string;
  projects?: ExperienceProject[];
  tools?: string[];
};

export type EducationInfo = {
  entries: EducationEntry[];
};

export type EducationEntry = {
  university: string;
  program: string;
  status?: string;
  dateRange?: string;
  highlights?: string[];
  tools?: string[];
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
  phone: '',
  location: 'Seattle, WA',
  bioLink: {
    text: 'Mathematics MS student (expected summer 2026)',
    url: mtuMathGraduateUrl,
  },
  bio:
`M.S. Mathematics student in the applied/computational track (expected Aug 2026) researching macrocirculatory hemodynamics.

Former data scientist and data pipeline engineer who built ingestion, analytics, and machine-learning solutions for a healthcare data platform.

Open-source contributions spanning Julia documentation, Microsoft Playwright, Data Build Tool community plugins, and scientific-computing libraries.

Seeking employment opportunities at the intersection of systems and production software (scientific computing, data platforms, ML/AI engineering).`,
};

export const codingExamples: CodingExample[] = [
    {
    title: 'typewriter CLI',
    description: 'Typewriter is a pip-installable CLI built on Typer and LibCST to normalize None-related type annotations while preserving formatting and comments.',
    links: ['https://github.com/danphenderson/python-typewriter'],
  },
  {
    title: 'chromex Python Library',
    description: "An asynchronous interface for headless browser automation's that is built on bs4 and selenium.",
    links: ['https://github.com/danphenderson/python-chromex'],
  },
  {
    title: 'Portfolio using React, TypeScript, and AWS',
    description: 'An interactive CV, climbing log, and photography galleries built with React + TypeScript + MUI and deployed on AWS using S3, CloudFront, and Route53.',
    links: ['https://github.com/danphenderson/dev-danhenderson'],
  },
  {
    title: 'BlockOpt.jl Julia Package',
    description: 'An optim-style Julia package built with ForwardDiff.jl and TRS.jl that presents a novel scheme for an unconstrained Quasi-Newton minimization of a smooth objective function.',
    links: ['https://github.com/danphenderson/BlockOpt.jl'],
  },
  {
    title: 'UncNLPrograms.jl Julia Package',
    description: 'A subset of high-dimensional, nonlinear, and unconstrained optimization problems from CUTEst in native Julia to test solvers using Automatic/Algorithmic Differentiation.',
    links: ['https://github.com/danphenderson/UncNLPrograms.jl'],
  },
  {
    title: 'MasterPlan Java Application',
    description: 'A Java application that allows users to create and manage a structure (directed acyclic graph) of tasks and corresponding subtasks.',
    links: ['https://github.com/danphenderson/masterplan-app'],
  },
  {
    title: 'LeetCode Python Solutions',
    description: 'A collection of LeetCode problems with corresponding solutions and brief discussions on the approaches used.',
    links: ['https://github.com/danphenderson/leetcode-solutions'],
  },
  {
    title: 'Runge-Kutta Methods Matlab Library',
    description: 'Implementation of various Runge-Kutta methods for solving ordinary differential equations.',
    links: ['https://github.com/danphenderson/runge-kutta-matlab'],
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
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Research Assistant | Hemodynamics',
    startDate: 'May 2025',
    endDate: 'Current',
    description:
      `Advisor: Jiguang Sun (Department of Mathematical Sciences).
      Researching macrocirculatory blood-flow and transport models governed by Navier--Stokes and convection-diffusion PDEs using traditional and machine-learning approaches.`,
    projects: [
      'Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).',
      'Scoped near-term simulation pathways from reduced-order models toward PINNs/DeepONets and fluid-structure interaction models.',
    ],
    tools: ['LaTeX', 'Julia', 'Python', 'Overleaf']
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Instructor | Calculus I with Technology',
    startDate: 'Jan 2025',
    endDate: 'May 2025 (5 mos)',
    description: 'Department of Mathematical Sciences Graduate Teaching Assistantship',
    projects: [
      'Taught a 4-credit undergraduate mathematics section, including recorded lectures, assessments, grading, office hours, and course administration.',
      'Coordinated content, rubrics, and student support with supervising faculty and peer instructors to keep sections aligned.',
      'Authored Mathematica walkthroughs that reinforced conceptual understanding and computational fluency.',
      'Earned a 4.8/5.0 average student evaluation score at a 58\% response rate.',
    ],
    tools: ['Mathematica', 'Gradescope', 'Canvas', 'Panapto', 'Zoom', 'HTML'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Teaching Assistant | Calculus I with Technology',
    startDate: 'Aug 2024',
    endDate: 'Dec 2024 (5 mos)',
    description:
      'Department of Mathematical Sciences Graduate Teaching Assistantship',
    projects: [
      'Managed grading and individualized feedback for an assigned section through Gradescope and office hours.',
      'Helped design rubrics so assessment remained consistent across sections.',
    ],
    tools: ['Gradescope', 'Canvas', 'Mathematica'],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer | Full Time',
    startDate: 'Apr 2022',
    endDate: 'Dec 2022 (9 mos)',
    description:
      'Contributor to entity-linking, recoding, and ingestion pipelines feeding a healthcare analytics lakehouse, implemented improvements that increased throughput and slashed cloud compute costs.',
    projects: [
      "Supported architectural design, releases, and deployments of data-engineering assets, including data governance, security, and integrity of the platform's data lakehouse.",
      "Repartitioned 50TB datalake, yielding improved query performance to accelerate nightly DBT builds and support analytics and reporting.",
      "Reduced AWS ETL cost by 50\% from upgrading ETL jobs to Glue 3.0 and moving batch workloads to EMR on transient EC2 fleets, supported by an internal platform library for provisioning, networking, security, monitoring, and scaling EMR clusters.",
      "Built a reconciliation service across PostgreSQL, AWS Glue Data Catalog, Redshift, and S3 to identify and resolve data inconsistencies, reducing tenant-state investigations from hours to minutes.",
      "Centralized infrastructure delivery by building an internal CDK library through a major refactor that removed technical debt and git submodules, while introducing semantic versioning practices, enabling more reliable and efficient deployments.",
      "Migrated data team’s software assets from Bitbucket to GitHub Enterprise, standardizing CI/CD into GitHub Actions and hooks.",
      "Processed AWS CloudTrail logs into Parquet and built a dashboard to support security analytics and HITRUST compliance.",
      "Supported hiring and onboarding during an organizational transition, including new engineering and data leadership and interns.",
    ],
    tools: [
      'AWS: EC2, S3, SNS, SQS, Cloudformation, Cloudtrail, Cloudwatch, Lambda, Glue (\& Glue Data Catalog), EMR, Redshift, RDS, Athena, Quicksight', 'Python', 'PySpark', 'Jupyter', 'DBT (Data Build Tool)', 'GitHub Enterprise', 'Docker',
      'Sentry', 'Slack', 'SonarCloud', 'Django', 'OpenAPI/Swagger', 'Jupyter', 'DBeaver', 'Postman', 'Visual Studio Code',
    ],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'Nov 2021',
    endDate: 'Apr 2022 (5 mos)',
    description:
      'Contributor to production ML and analytics layers of a multi-tenant cloud health data platform.',
    projects: [
      'Introduced CI/CD for machine-learning code, infrastructure, and model artifacts with AWS CDK and Bitbucket Pipelines, safeguarding our workflows and streamlining deployment processes.',
      'Developed a schema-agnostic anomaly-detection pipeline and presented the workflow for broader team adoption, using PySpark isolation forest models to identify outliers in the platform`s S3 data lake.',
      'Built an internal ML library that standardized training, deployment, logging, and cloud configuration, enabling portable ML workflows.',
      'Contributed to a deduplication model with a human-in-the-loop training loop driven by platform user feedback.',
      'Supported restricted offshore data engineers with deployments, code review, ETL troubleshooting, and unit tests to accelerate delivery.',
      'Migrated patient electronic medical record data from a client system into the platform, supporting schema mapping, ingestion, and validation.'
    ],
    tools: ['AWS', 'Python', 'Jupyter', 'DBT (Data Build Tool)', 'Bitbucket', 'SciPy', 'PySpark', 'Visual Studio Code', 'DBeaver', 'Slack', 'Sentry', 'Slack', 'Jira', 'Confluence', 'Lucidchart'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Research Assistant | Full Time',
    startDate: 'May 2021',
    endDate: 'Nov 2021 (5 mos)',
    description: 'Contributor to quasi-Newton optimization research (Azzam, Henderson, Ong, Struthers; 2022).',
    projects: [
      '2022, Azzam J, Henderson D, Ong BW, and Struthers AA, Quasi-Newton Optimization with Hessian Samples',
      'Built BlockOpt.jl, an open-source Julia implementation of the paper’s trust-region quasi-Newton methods.',
      'Built UncNLPrograms.jl to create an automatic-differentiation optimization benchmark suite to test paper’s methods.',
      { text: 'Article:', link: 'https://lnkd.in/gfP39wZX' },
      { text: 'Zenodo DOI:', link: 'https://zenodo.org/record/5826808#.Y_QyR-zMJzW' },
      { text: 'Documentation:', link: 'https://danphenderson.github.io/BlockOpt.jl/dev/' },
      { text: 'Repository (BlockOpt.jl):', link: 'https://github.com/danphenderson/BlockOpt.jl' },
      { text: 'Repository (UncNLPrograms.jl):', link: 'https://github.com/danphenderson/UncNLPrograms.jl' },
    ],
    tools: ['Julia', 'ForwardDiff.jl', 'CUTEst', 'LaTeX', 'TRS.jl', 'Mathematica', 'Overleaf'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'September 2015',
    endDate: 'May 2018 (2 yrs 9 mos)',
    description: 'Tutor to NCAA student-athletes in calculus (I, II, \& III), ordinary differential equations, and linear algebra.',
    projects: [],
    tools: ['Mathematica']
  },
];

export const educationInfo: EducationInfo = {
  entries: [
    {
      university: 'Michigan Technological University',
      program: 'MS Mathematics, Applied/Computational',
      status: 'Expected Summer 2026',
      dateRange: 'Fall 2024 – Present',
      highlights: [
        'Advisor: Jiguang Sun (Department of Mathematical Sciences).',
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.',
        'Submissions to Numerical Analysis: A Graduate Course errata, improving correctness and clarity in the text.',
        "Coursework: Linear Algebra, Numerical Optimization, Error-Correcting Codes, Theoretical Numerical Analysis, Ordinary Differential Equations, Partial Differential Equations, Numerical Methods for PDEs, Discontinuous Galerkin Methods, Teaching College Mathematics"
      ],
      tools: ['LaTeX', 'Julia', 'Python', 'Mathematica', 'Overleaf', 'Visual Studio Code'],
    },
    {
      university: 'Michigan Technological University',
      program: 'B.S. Cum Laude, Mathematics, Applied/Computational & Minor in Computer Science',
      status: 'Cumulative: 3.56 | Departmental: 3.71',
      highlights: [
        'President & V.P., Finance Club',
        'Representative, Undergraduate Student Government',
        'Member, Ways and Means Committee, allocating $700K to 220 student organizations',
        "Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K",
        'Student Advisor to the Dean of the School of Business and Economics',
        'Junior Partner, Applied Portfolio Management Program ($1.8M AUM)',
        "Recipient of Dean's List award for six semesters (Spring 2015, Summer 2015, Fall 2019, Spring 2020, Fall 2020, & Spring 2021)",
        'Certificate of Merit for Outstanding Academic Achievement in Calculus II with Technology, Mathematical Sciences Department',
        "Relevant Coursework: Scientific Computing, Programming at Software & Hardware interface, Data Structures, Formal Models of Computation, Artificial Intelligence, Concurrent Computing, Optimization & Graph Algorithms, Team Software Project, Real Analysis (I \& II), Abstract Algebra, Complex Analysis, Linear Algebra, Numerical Linear Algebra, Ordinary Differential Equations, Partial Differential Equations (PDEs), Numerical Methods for PDEs, Nonlinear Dynamics and Chaos, Combinatorics, Probability, Statistics (I & II), Regression Analysis, History of Mathematics"
      ],
      tools: ['Java', 'C', 'C++', 'Python', 'Matlab', 'Mathematica', 'SQL', 'Assembly (MIPS)'],
    },
  ],
};

export const stackAndTools: StackSection[] = [
  {
    title: 'Development Stack and Tools',
    items: [
      'macOS',
      'Homebrew package manager',
      'Vim & Visual Studio Code for Editor & IDE',
      'Zsh (also Bash)',
      'Python (general purpose goto language)',
      'TypeScript',
      'AWS',
      'pre-commit',
      'github CLI (`gh`)',
      'Docker & docker-compose',
      'GitHub Actions (CI/CD)',
      'AWS CDK (IaC)',
      'REPLs',
      'Mermaid',
      'jq',
      'juliaup',
      'pipenv',
      '.editorconfig',
      'prettier',
      'pre-commit',
    ],
  },
  {
    title: 'Programing & Scripting Languages',
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
      'JavaScript',
      'TypeScript',
    ],
  },
  {
    title: 'ETL & API Frameworks',
    items: ['Data Build Tool (DBT)', 'Django', 'FastAPI', 'Apache Spark (PySpark)'],
  },
  {
    title: 'Databases',
    items: ['Redshift', 'PostgreSQL', 'Neo4j'],
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
      'Visual Studio Code',
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
