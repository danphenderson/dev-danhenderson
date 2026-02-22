export const assetBasePath = process.env.PUBLIC_URL || '';

export const avatar = `${assetBasePath}/assets/home.jpg`;
export const cvBackgroundImage = `${assetBasePath}/assets/photography/landscape/landscape-tieton-south-fork-3.jpg`;

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
  impactSummary?: string;
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
  bio: `Ex–Lucerna Health data scientist/pipeline engineer: built cloud-native ingestion + analytics infrastructure that boosted throughput 50%+ and reduced compute costs.

Current Math MS student (expected summer 2026). Research: numerical methods for differential equations in hemodynamics; additional work in smooth optimization and benchmarking across Julia, Python, and C.

Interested in applied roles at the intersection of math, systems, and production software (scientific computing, data platforms, ML/AI engineering).`,
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
    links: ['https://github.com/danphenderson/dev-danhenderson'],
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
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Research Assistant | Hemodynamics',
    startDate: 'May 2025',
    endDate: 'Current',
    impactSummary: 'Computational hemodynamics research focused on modeling rigor and practical numerical pathways.',
    impactHighlights: [
      'Formalized continuum mechanics foundations used to derive vascular flow conservation laws.',
      'Analyzed incompressible Navier-Stokes variants across Newtonian and generalized-Newtonian assumptions.',
      'Scoped near-term simulation pathways from reduced-order models toward PINNs/DeepONets and FSI.',
    ],
    description:
      'Advisor: Jiguang Sun (Department of Mathematical Sciences). Hemodynamics modeling and numerical methods for macrocirculatory blood flow.',
    projects: [
      'Report on hemodynamics modeling and methods report for macrocirculatory blood flow, formalizing the continuum mechanics framework (Eulerian/Lagrangian descriptions, material derivative, and Reynolds transport theorem) used to derive conservation laws for vascular flow.',
      'Derived and analyzed incompressible Navier–Stokes formulations for blood (including Newtonian and generalized-Newtonian viscosity models), documenting the kinematic roles of Reynolds/Womersley numbers and related nondimensional parameters relevant to large-vessel regimes.',
      'Scoped numerical pathways from dimension-reduced 1D/2D flow simulations to study modern computational directions including PINNs/DeepONets and fluid–structure interaction for compliant vessels.',
    ],
    tools: ['LaTeX', 'Julia', 'Python']
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Instructor | Calculus I with Technology',
    startDate: 'Jan 2025',
    endDate: 'May 2025 (5 mos)',
    impactSummary: 'Owned full-course delivery with strong student feedback and high engagement.',
    impactHighlights: [
      'Managed lectures, assessments, grading, and logistics for Calculus I with Technology.',
      'Integrated applied tooling to improve conceptual understanding and computational fluency.',
      'Received 4.8/5.0 student evaluations with a 58% response rate.',
    ],
    description: 'Department of Mathematical Sciences. Instructor of Calculus I with Technology.',
    projects: [
      'Calculus I with Technology, managing full course delivery: lectures, assessments, grading, and end-to-end course administration.',
      'Integrated technology into lessons and assignments to improve conceptual understanding and promote computational thinking.',
      'Earned a strong student evaluation score of 4.8/5.0 with an above average 58% response rate (Fall 2025 median response rate: 53.13).',
    ],
    tools: ['Mathematica', 'Gradescope', 'Canvas', 'Panapto', 'Zoom'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Teaching Assistant | Calculus I with Technology',
    startDate: 'Aug 2024',
    endDate: 'Dec 2024 (5 mos)',
    impactSummary: 'Improved consistency and turnaround for course logistics while supporting student technology workflows.',
    impactHighlights: [
      'Coordinated grading operations and rubric quality with course instructor.',
      'Provided individual feedback and troubleshooting for assignment/tooling workflows.',
    ],
    description:
      'Department of Mathematical Sciences. Coordinated grading/logistics and supported students with technology-based workflows.',
    projects: [
      'Coordinated instructional logistics and grading with the instructor; maintained consistent rubrics and timely turnaround to support student progress.',
      'Provided individualized feedback on assignments/exams and supported students with technology-based workflows (Mathematica).',
    ],
    tools: ['Gradescope', 'Canvas'],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer | Full Time',
    startDate: 'Apr 2022',
    endDate: 'Dec 2022 (9 mos)',
    impactSummary: 'Led critical ingestion and platform pipeline improvements that increased throughput and lowered compute costs.',
    impactHighlights: [
      'Repartitioned roughly 50TB of parquet data to accelerate nightly DBT builds.',
      'Reduced infrastructure cost by upgrading to Glue 3.0 and shifting heavy jobs onto transient EMR fleets.',
      'Built an admin service that cut support ticket triage time across PostgreSQL, Glue, Redshift, and S3.',
    ],
    description:
      'Lead on Lucerna’s entity linking, ingestion, and recoding pipelines powering the data platform.',
    projects: [
      "Improved company’s Entity Linking, Ingestion, and Recoding pipelines driving the cloud platform’s analytics layer (data lakehouse).",
      "Repartitioned approx 50TB of parquet data, accelerating nightly DBT builds of platform's analytics layer.",
      "Assisted in architectural design, releases, and deployments of data-engineering assets, including data governance, security, and integrity of the platform's analytics data layer (data lakehouse).",
      "Built an admin service to automate integrity/state of tenant's platform across PostgreSQL, AWS Glue Data Catalog, Redshift, and S3, reducing time to resolve service tickets.",
      'Delivered cost savings by upgrading ETL runtime to AWS Glue 3.0 and migrating batch processing to transient AWS EMR workloads using EC2 instance fleets; abstracted autoscaling, bootstrapping, provisioning, security, and networking into a reusable library.',
      'Migrated shared ETL/infrastructure assets from Bitbucket to GitHub Enterprise and standardized CI/CD with GitHub Actions workflows, hooks, and templates.',
      'Centralized cloud-infrastructure deployments through a major refactor that removed technical debt and git submodules while introducing semantic versioning practices.',
      'Stepped up during team turnover by representing the data team in engineering design discussions and assisted in hiring/interviews and onboarding for directors, lead engineers, and interns.',
    ],
    tools: [
      'AWS CDK & SDK (Python)',
      'SNS',
      'SQS',
      'Lambda',
      'Glue 3.0',
      'Glue Data Catalog',
      'S3',
      'Redshift',
      'PostgreSQL',
      'EMR (Spark)',
      'EC2 Instance Fleets',
      'Bitbucket',
      'GitHub Enterprise',
      'GitHub Actions',
      'Docker (docker-compose)',
      'Sentry',
      'Slack',
      'SonarCloud',
      'Django',
      'Python',
    ],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'Nov 2021',
    endDate: 'Apr 2022 (6 mos)',
    impactSummary: 'Built production-ready analytics and ML workflows for a multi-tenant health data platform on AWS.',
    impactHighlights: [
      'Delivered anomaly detection workflows in PySpark isolation forest across S3 lake data.',
      'Automated deployment/version safeguards for ML assets with AWS CDK and Bitbucket Pipelines.',
      'Designed a shared ML library to standardize secure, reusable cloud workflows.',
    ],
    description:
      'Production ML and analytics engineering on AWS for a multi-tenant health data platform.',
    projects: [
      'Implemented version-control safeguards for production ML assets and automated deployments using AWS CDK and Bitbucket Pipelines.',
      'Built an anomaly-detection pipeline using PySpark isolation forest to flag anomalous records in S3 data lake.',
      'Designed and build shared ML library to abstract security and cloud infrastructure concerns, enabling portable ML workflows.',
      'Developed a cost-effective, scalable PySpark analytics service to meet data governance requirements supporting HiTrust certification.',
      'Collaborated on a deduplication ML hook in the ingestion pipeline, enabling human-in-the-loop training and parameter evaluation.',
      'Unblocked restricted-offshore developers via infrastructure deployments, code reviews, ETL support, and QA testing to accelerate delivery.',
    ],
    tools: ['AWS CDK & SDK (Python)', 'Bitbucket Pipelines', 'Python', 'SciPy', 'Numpy', 'Pandas', 'PySpark'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Research Assistant | Full Time',
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
    tools: ['Julia', 'ForwardDiff.jl', 'CUTEst', 'LaTeX', 'TRS.jl', 'Mathematica', 'Overleaf'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'September 2015',
    endDate: 'May 2018 (3 yrs 5 mos)',
    description: 'Provided weekly tutoring services to NCAA student-athletes in multivariable, integral and differential calculus, ordinary differential equations, and linear algebra.',
    projects: [],
    tools: ['Mathematica']
  },
];

export const educationInfo: EducationInfo = {
  entries: [
    {
      university: 'Michigan Technological University',
      program: 'MS Program in Mathematics',
      status: 'M.S. expected Summer 2026',
      dateRange: 'Fall 2024 – Present',
      highlights: [
        'Graduate coursework in numerical and functional analysis, differential equations, optimization, and scientific computing',
        'Pedagogical coursework: Teaching College Mathematics, emphasizing curriculum design, assessment, and evidence-based instructional practice',
        'Research focuses on computational hemodynamics.',
        'Developing reproducible and performance-critical scientific software in Julia and Python.',
      ],
      tools: ['LaTeX', 'Julia', 'Python', 'Mathematica'],
    },
    {
      university: 'Michigan Technological University',
      program: 'B.S. Cum Laude, Mathematics, Applied/Computational & Minor in Computer Science',
      status: 'Cumulative: 3.56 | Departmental: 3.71',
      highlights: [
        'President & V.P., Finance Club',
        'Representative, Undergraduate Student Government',
        'Member, Ways and Means Committee, allocating $700K to 200+ student organizations',
        "Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K",
        'Student Advisor to the Dean of the School of Business and Economics',
        'Junior Partner, Applied Portfolio Management Program',
        "Recipient of Dean's List award for six semesters (Spring 2015, Summer 2015, Fall 2019, Spring 2020, Fall 2020, & Spring 2021)",
        'Certificate of Merit for Outstanding Academic Achievement in Calculus II with Technology, Mathematical Sciences Department',
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
      'React',
      'PostgreSQL',
      'AWS',
      'pre-commit',
      'github CLI (`gh`)',
      'Docker & docker-compose',
      'GitHub Actions (CI/CD)',
      'AWS CDK (IaC)',
      'Jira',
      'Notion',
      'Sentry',
      'Sonarqube',
      'Jupyter Notebooks',
      'REPLs',
      'Mermaid',
      'jq',
      'DBeaver',
      'Lucid',
      'OpenAPI/Swagger',
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
