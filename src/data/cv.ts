import type {
  AboutMe,
  Certificate,
  CodingExample,
  EducationInfo,
  Experience,
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
  StackSection,
  VolunteeringEntry,
} from '../types/cv';
import { resolvePublicAssetPath } from '../utils/assets';

export type {
  AboutMe,
  Certificate,
  CodingExample,
  CodingExampleTab,
  EducationEntry,
  EducationInfo,
  Experience,
  ExperienceDescription,
  ExperienceProject,
  ExperienceProjectSegment,
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
  StackSection,
  VolunteeringEntry,
} from '../types/cv';

const assetPath = (path: string) => resolvePublicAssetPath(path);

export const avatar = assetPath('/assets/home.jpg');
export const cvBackgroundImage = assetPath('/assets/photography/landscape/landscape-tieton-south-fork-3.jpg');
export const resumePdfUrl = assetPath('/assets/daniel-henderson-resume.pdf');
export const resumeDownloadFilename = 'Daniel-Henderson-Resume.pdf';

export const githubUsername = 'danphenderson';
export const githubProfileUrl = 'https://github.com/danphenderson';
export const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/';
const mtuMathGraduateUrl = 'https://www.mtu.edu/math/graduate/students/';
export const githubSectionLead =
  'Recent activity, open-source contributions, and public repositories from GitHub.';
export const stackAndToolsLead =
  'Daily development environment, languages, platform tooling, and services used across software, research, and data work.';

export const aboutMe: AboutMe = {
  name: 'Daniel Henderson',
  title: 'Software Engineer',
  email: 'me@danhenderson.dev',
  phone: '',
  location: 'Seattle, WA',
  bioLink: {
    text: 'M.S. Mathematics student in the applied/computational track (expected Aug 2026)',
    url: mtuMathGraduateUrl,
  },
  bio:
`M.S. Mathematics student in the applied/computational track (expected Aug 2026) researching macrocirculatory hemodynamics.

Former data scientist and data pipeline engineer who built ingestion, analytics, and machine-learning solutions for a healthcare data platform.

Open-source contributions spanning Julia documentation, Microsoft Playwright, Data Build Tool community plugins, and scientific-computing libraries.

Open to opportunities at the intersection of systems and production software (scientific computing, data platforms, ML/AI engineering).`,
};

export const codingExamples: CodingExample[] = [
  {
    title: 'typewriter CLI',
    description: 'Typewriter is a pip-installable CLI built on Typer and LibCST to normalize None-related type annotations while preserving formatting and comments.',
    links: ['https://github.com/danphenderson/python-typewriter'],
    tabs: [
      {
        value: 'purpose',
        label: 'Purpose',
        kind: 'list',
        items: [
          'Normalize `None`-related annotations across a codebase.',
          'Target repo-wide cleanup rather than ad-hoc edits.',
          'Preserve formatting and comments while changing types.',
        ],
      },
      {
        value: 'rewrites',
        label: 'Rewrites',
        kind: 'list',
        items: [
          'Use concrete-syntax-tree transforms instead of regex replacement.',
          'Keep diffs readable after automated edits.',
          'Package the workflow as a pip-installable CLI.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Python', 'Typer', 'LibCST', 'CLI tooling', 'Type annotations'],
      },
    ],
  },
  {
    title: 'chromex Python Library',
    description: "An asynchronous interface for headless browser automation's that is built on bs4 and selenium.",
    links: ['https://github.com/danphenderson/python-chromex'],
    tabs: [
      {
        value: 'workflow',
        label: 'Workflow',
        kind: 'list',
        items: [
          'Wrap headless-browser automation behind an async-friendly Python interface.',
          'Target pages that need a real browser before extraction.',
          'Bridge navigation, automation, and parsing in one flow.',
        ],
      },
      {
        value: 'automation',
        label: 'Automation',
        kind: 'list',
        items: [
          'Pair Selenium-driven rendering with BeautifulSoup-based parsing.',
          'Support scripted browsing and scraping workloads.',
          'Abstract repeated browser-session plumbing into a reusable library.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Python', 'asyncio', 'Selenium', 'BeautifulSoup', 'Browser automation'],
      },
    ],
  },
  {
    title: 'Portfolio using React, TypeScript, and AWS',
    description: 'An interactive CV, climbing log, and photography galleries built with React + TypeScript + MUI and deployed on AWS using S3, CloudFront, and Route53.',
    links: ['https://github.com/danphenderson/dev-danhenderson'],
    tabs: [
      {
        value: 'product',
        label: 'Product',
        kind: 'list',
        items: [
          'Combine an interactive CV, climbing log, and photography galleries in one SPA.',
          'Keep content in TypeScript data modules for static hosting.',
          'Enhance the CV with GitHub-backed data when available.',
        ],
      },
      {
        value: 'architecture',
        label: 'Architecture',
        kind: 'list',
        items: [
          'Use client-side routing with host rewrites to `index.html`.',
          'Reuse MUI/CV primitives to keep sections consistent.',
          'Preserve `PUBLIC_URL`-compatible asset handling for deployment.',
        ],
      },
      {
        value: 'cloud',
        label: 'Cloud',
        kind: 'skills',
        skills: ['React', 'TypeScript', 'MUI', 'React Router', 'AWS S3', 'CloudFront', 'Route53'],
      },
    ],
  },
  {
    title: 'BlockOpt.jl Julia Package',
    description: 'An optim-style Julia package built with ForwardDiff.jl and TRS.jl that presents a novel scheme for an unconstrained Quasi-Newton minimization of a smooth objective function.',
    links: ['https://github.com/danphenderson/BlockOpt.jl'],
    tabs: [
      {
        value: 'research',
        label: 'Research',
        kind: 'list',
        items: [
          'Explore a block-oriented quasi-Newton approach for smooth unconstrained minimization.',
          'Frame the repo as solver experimentation, not just utility wrappers.',
          'Target optimization problems where derivative information matters.',
        ],
      },
      {
        value: 'numerics',
        label: 'Numerics',
        kind: 'list',
        items: [
          'Use automatic differentiation for derivative evaluation.',
          'Rely on trust-region tooling to support iterative minimization.',
          'Position Julia as the environment for numerical experimentation.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Julia', 'ForwardDiff.jl', 'TRS.jl', 'Numerical optimization', 'Scientific computing'],
      },
    ],
  },
  {
    title: 'UncNLPrograms.jl Julia Package',
    description: 'A subset of high-dimensional, nonlinear, and unconstrained optimization problems from CUTEst in native Julia to test solvers using Automatic/Algorithmic Differentiation.',
    links: ['https://github.com/danphenderson/UncNLPrograms.jl'],
    tabs: [
      {
        value: 'benchmarks',
        label: 'Benchmarks',
        kind: 'list',
        items: [
          'Port a subset of nonlinear unconstrained test problems into native Julia.',
          'Reduce friction when benchmarking solvers on high-dimensional problems.',
          'Create reusable problem definitions for experimentation.',
        ],
      },
      {
        value: 'solver-use',
        label: 'Solver Use',
        kind: 'list',
        items: [
          'Support AD-friendly optimization workflows without external wrappers.',
          'Help compare solver behavior across a consistent benchmark set.',
          'Complement nonlinear optimization research work.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Julia', 'CUTEst-style benchmarks', 'Automatic differentiation', 'Nonlinear optimization', 'Scientific computing'],
      },
    ],
  },
  {
    title: 'MasterPlan Java Application',
    description: 'A Java application that allows users to create and manage a structure (directed acyclic graph) of tasks and corresponding subtasks.',
    links: ['https://github.com/danphenderson/masterplan-app'],
    tabs: [
      {
        value: 'planning',
        label: 'Planning',
        kind: 'list',
        items: [
          'Let users model tasks and subtasks as a directed acyclic graph.',
          'Turn dependency structure into a clearer execution order.',
          'Focus on breaking larger work into manageable units.',
        ],
      },
      {
        value: 'model',
        label: 'Model',
        kind: 'list',
        items: [
          'Use DAG rules to prevent cyclic task relationships.',
          'Highlight graph-based domain modeling in a Java application.',
          'Treat dependency management as the core product behavior.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Java', 'DAG data model', 'Task management', 'Object-oriented design'],
      },
    ],
  },
  {
    title: 'LeetCode Python Solutions',
    description: 'A collection of LeetCode problems with corresponding solutions and brief discussions on the approaches used.',
    links: ['https://github.com/danphenderson/leetcode-solutions'],
    tabs: [
      {
        value: 'practice',
        label: 'Practice',
        kind: 'list',
        items: [
          'Store worked problems with matching Python solutions.',
          'Add brief discussions so the repo is useful for review, not just submission history.',
          'Act as a reusable study reference for interview prep.',
        ],
      },
      {
        value: 'patterns',
        label: 'Patterns',
        kind: 'list',
        items: [
          'Emphasize clean implementations over throwaway one-off code.',
          'Make common algorithmic patterns easier to revisit.',
          'Support repeated practice with lightweight written reasoning.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['Python', 'Algorithms', 'Data structures', 'Interview practice'],
      },
    ],
  },
  {
    title: 'Runge-Kutta Methods Matlab Library',
    description: 'Implementation of various Runge-Kutta methods for solving ordinary differential equations.',
    links: ['https://github.com/danphenderson/runge-kutta-matlab'],
    tabs: [
      {
        value: 'methods',
        label: 'Methods',
        kind: 'list',
        items: [
          'Implement multiple Runge-Kutta methods for solving ordinary differential equations.',
          'Package them as reusable MATLAB routines instead of isolated scripts.',
          'Center the library on numerical-method experimentation.',
        ],
      },
      {
        value: 'numerics',
        label: 'Numerics',
        kind: 'list',
        items: [
          'Support comparison of integrators across accuracy and stability tradeoffs.',
          'Keep solver behavior inspectable for coursework or research.',
          'Focus on classical ODE time-stepping techniques.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: ['MATLAB', 'ODE solvers', 'Runge-Kutta methods', 'Numerical analysis'],
      },
    ],
  },
];

export const certificates: Certificate[] = [
  {
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    date: 'February 5th, 2024',
    link: assetPath('/assets/aws-soln-architect-cert.pdf'),
  },
  {
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'January 19th, 2024',
    link: assetPath('/assets/aws-cloud-practitioner-cert.pdf'),
  },
];

export const experiences: Experience[] = [
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Research Assistant',
    startDate: 'May 2025',
    endDate: 'Current',
    description:
      [
        {
          text:
            'Researching blood-flow and transport models governed by Navier--Stokes and convection-diffusion PDEs using traditional and machine-learning approaches.',
        },
        {
          text: ' Advisor: ',
          lineBreakBefore: false,
        },
        {
          text: 'Jiguang Sun',
          link: 'https://pages.mtu.edu/~jiguangs/Homepage_of_Jiguang_Sun/Welcome.html',
        },
      ],
    projects: [
      'Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).',
      'Derived and analyzed Navier–Stokes formulations for blood (including Newtonian and generalized-Newtonian viscosity models), documenting the kinematic roles of Reynolds/Womersley numbers and related nondimensional parameters.',
      'Scoped numerical pathways from dimension-reduced 1D/2D flow simulations incorporating fluid-structure interaction models toward PINNs/DeepONets.',
    ],
    skills: ['Research', 'Computational Fluid Dynamics', 'Julia', 'Python', 'PyTorch', 'DeepXDE', 'SciML', 'SciPy', 'LaTeX', 'Overleaf + GitHub', 'Visual Studio Code', 'Shells, REPLs, and Notebooks'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Instructor',
    startDate: 'Jan 2025',
    endDate: 'May 2025 (5 mos)',
    description: 'Department of Mathematical Sciences Graduate Teaching Assistantship instructor of Calculus I with Technology',
    projects: [
      'Taught a 4-credit undergraduate mathematics section, delivering recorded lectures, proctoring exams, holding office hours, and managing grading and day-to-day course operations.',
      'Delivered lecture material consistently and on schedule, maintaining alignment with the course coordinator’s instructional plan.',
      'Coordinated content, rubrics, and student support across recitations with supervising faculty and peer instructors to maintain consistency across sections.',
      'Developed Mathematica notebook walkthroughs that reinforced conceptual understanding and computational fluency.',
      'Earned a 4.8/5.0 average student evaluation score with a 58% response rate, above the university average.',
    ],
    skills: ['University Teaching', 'Canvas', 'Gradescope', 'Panapto', 'Zoom', 'Mathematica', 'HTML'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Graduate Teaching Assistant',
    startDate: 'Aug 2024',
    endDate: 'Dec 2024 (5 mos)',
    description:
      'Department of Mathematical Sciences Graduate Teaching Assistantship assistant of Calculus I with Technology',
    projects: [
      'Managed grading and individualized feedback for an assigned section through Gradescope and office hours.',
      'Helped design rubrics so assessment remained consistent across sections.',
    ],
    skills: ['University Teaching Training', 'Gradescope', 'Canvas'],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer',
    startDate: 'Apr 2022',
    endDate: 'Dec 2022 (9 mos)',
    description:
      'Contributor to entity-linking, recoding, and ingestion pipelines feeding a healthcare analytics lakehouse, implemented improvements that increased throughput and slashed cloud compute costs.',
    projects: [
      "Supported architectural design, releases, and deployments of data-engineering assets, including data governance, security, and integrity of the platform's data lakehouse.",
      "Repartitioned 50TB datalake, yielding improved query performance to accelerate nightly DBT builds and support analytics and reporting.",
      "Reduced AWS ETL cost by 50% from upgrading ETL jobs to Glue 3.0 and moving batch workloads to EMR on transient EC2 fleets, supported by an internal platform library for provisioning, networking, security, monitoring, and scaling EMR clusters.",
      "Built a reconciliation service across PostgreSQL, AWS Glue Data Catalog, Redshift, and S3 to identify and resolve data inconsistencies, reducing tenant-state investigations from hours to minutes.",
      "Centralized infrastructure delivery by building an internal CDK library through a major refactor that removed technical debt and git submodules, while introducing semantic versioning practices, enabling more reliable and efficient deployments.",
      "Migrated data team’s software assets from Bitbucket to GitHub Enterprise, standardizing CI/CD into GitHub Actions and hooks.",
      "Processed AWS CloudTrail logs into Parquet and built a dashboard to support security analytics and HITRUST compliance.",
      "Supported hiring and onboarding during an organizational transition, including new engineering and data leadership and interns, and helped ensure continuity through a reorganization that included my departure.",
    ],
    skills: [
      'AWS: EC2, S3, SNS, SQS, Cloudformation, Cloudtrail, Cloudwatch, Lambda, Glue (& Glue Data Catalog), EMR, Redshift, RDS, Athena, Quicksight', 'Python', 'PySpark', 'Jupyter', 'DBT (Data Build Tool)', 'GitHub Enterprise', 'Docker',
      'Sentry', 'Slack', 'SonarCloud', 'Django', 'OpenAPI/Swagger', 'Jupyter', 'DBeaver', 'Postman', 'Visual Studio Code',
    ],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'Nov 2021',
    endDate: 'Apr 2022 (6 mos)',
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
    skills: ['AWS', 'Python', 'Jupyter', 'DBT (Data Build Tool)', 'Bitbucket', 'SciPy', 'PySpark', 'Visual Studio Code', 'DBeaver', 'Slack', 'Sentry', 'Slack', 'Jira', 'Confluence', 'Lucidchart'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Research Assistant | Full Time',
    startDate: 'May 2021',
    endDate: 'Nov 2021 (7 mos)',
    description: 'Contributor to quasi-Newton optimization research (Azzam, Henderson, Ong, Struthers; 2022), led numerical experiments.',
    projects: [
      [
        { text: '2022, Azzam J, Henderson D, Ong BW, and Struthers AA, ' },
        { text: 'Quasi-Newton Optimization with Hessian Samples', link: 'https://lnkd.in/gfP39wZX' },
      ],
      [
        { text: 'Built ' },
        { text: 'BlockOpt.jl', link: 'https://github.com/danphenderson/BlockOpt.jl' },
        { text: ', an open-source Julia implementation of the paper’s trust-region quasi-Newton methods.' },
      ],
      [
        { text: 'Built ' },
        { text: 'UncNLPrograms.jl', link: 'https://github.com/danphenderson/UncNLPrograms.jl' },
        { text: ' to create an automatic-differentiation optimization benchmark suite to test paper’s methods.' },
      ],
    ],
    skills: ['Research', 'Julia', 'ForwardDiff.jl', 'CUTEst', 'LaTeX', 'TRS.jl', 'Mathematica', 'Overleaf'],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'September 2015',
    endDate: 'May 2018 (2 yrs 9 mos)',
    description: 'Tutor to NCAA student-athletes in calculus (I, II, & III), ordinary differential equations, and linear algebra.',
    projects: [],
    skills: ['Teaching', 'Mathematica']
  },
    {
    company: 'Various Locations',
    companyUrl: mtuMathGraduateUrl,
    industry: 'Retail & Service',
    title: 'Bike Mechanic & Service Technician',
    startDate: 'Various Periods Starting 2012',
    endDate: 'Aug 2024',
    description: 'Worked full-time and part-time at bike and ski shops in Arizona, Michigan, Utah, & Washington.',
    projects: ['Diagnosed and serviced mechanical issues across customer and rental bicycles with consistent turnaround and quality.',
      'Managed end-to-end service and sale workflows in retail and rental environments, including intake, triage, repair prioritization, point-of-sale transactions, rental check-in/check-out, and insurance claim support.',
      'Applied structured troubleshooting and clear customer communication to recommend repairs, explain technical issues, and improve rider safety, equipment reliability, and overall service experience.'
    ],
    skills: ['Lightspeed', 'Customer Service']
  },
];

export const educationInfo: EducationInfo = {
  entries: [
    {
      university: 'Michigan Technological University',
      program: 'MS Mathematics, Applied/Computational',
      summary:
        'Graduate work centered on applied mathematics, numerical methods, and computational modeling for hemodynamics research.',
      dateRange: 'Fall 2024 – Present',
      expectedCompletion: 'Expected Summer 2026',
      gpa: 'Cumulative: 3.44',
      highlights: [
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.',
        'Submissions to Numerical Analysis: A Graduate Course errata, improving correctness and clarity in the text.',
        "Coursework: Linear Algebra, Numerical Optimization, Error-Correcting Codes, Theoretical Numerical Analysis, Ordinary Differential Equations, Partial Differential Equations, Numerical Methods for PDEs, Discontinuous Galerkin Methods, Teaching College Mathematics"
      ],
      skills: ['LaTeX', 'Julia', 'Python', 'Mathematica', 'Overleaf', 'Visual Studio Code'],
    },
    {
      university: 'Michigan Technological University',
      program: 'B.S. Cum Laude, Mathematics, Applied/Computational',
      summary:
        'Applied/computational mathematics degree paired with computer science coursework, scientific computing, and campus leadership experience.',
      minor: 'Computer Science',
      gpa: 'Cumulative: 3.56 | Departmental: 3.71',
      highlights: [
        'President & V.P., Finance Club',
        'Representative, Undergraduate Student Government',
        'Member, Ways and Means Committee, allocating $700K to 220 student organizations',
        "Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K",
        'Student Advisor to the Dean of the School of Business and Economics',
        'Junior Partner, Applied Portfolio Management Program ($1.8M AUM)',
        "Recipient of Dean's List award for six semesters (Spring 2015, Summer 2015, Fall 2019, Spring 2020, Fall 2020, & Spring 2021)",
        'Certificate of Merit for Outstanding Academic Achievement in Calculus II with Technology, Mathematical Sciences Department',
        "Relevant Coursework: Scientific Computing, Programming at Software & Hardware interface, Data Structures, Formal Models of Computation, Artificial Intelligence, Concurrent Computing, Optimization & Graph Algorithms, Team Software Project, Real Analysis (I & II), Abstract Algebra, Complex Analysis, Linear Algebra, Numerical Linear Algebra, Ordinary Differential Equations, Partial Differential Equations (PDEs), Numerical Methods for PDEs, Nonlinear Dynamics and Chaos, Combinatorics, Probability, Statistics (I & II), Regression Analysis, History of Mathematics"
      ],
      skills: ['Java', 'C', 'C++', 'Python', 'Matlab', 'Mathematica', 'SQL', 'Assembly (MIPS)'],
    },
  ],
};

export const volunteering: VolunteeringEntry[] = [
  {
    organization: 'Little Brothers',
    role: 'Friends of the Elderly',
    summary:
      'Service work focused on restoring donated medical equipment so it could be reused in support of older adults in the community.',
    dateRange: 'Feb 2026',
    location: 'Houghton, MI',
    highlights: [
      'Contributed 16 volunteer hours sorting, cleaning, and repairing donated medical equipment accumulated over 20 years for reuse in support of isolated seniors.',
    ],
  },
  {
    organization: 'Access Fund',
    organizationUrl: 'https://www.accessfund.org',
    role: 'Conservation Team',
    summary:
      'Stewardship volunteer work supporting access, trail durability, and maintenance at major climbing areas.',
    dateRange: 'May 2019 – Present',
    location: 'Scarface Trail (Indian Creek, UT), Silver Mountain, MI, and Index, WA.',
    highlights: [
      'Supported trail construction and maintenance projects with the Access Fund conservation team at major climbing areas.',
    ],
  },
  {
    organization: 'MidWest Devo',
    role: 'Co-Founder & Volunteer Leadership',
    summary:
      'Grassroots youth cycling program leadership spanning fundraising, athlete support, and community program building.',
    dateRange: 'Feb 2013 – Feb 2015',
    location: 'United States',
    highlights: [
      'Co-founded regional youth cycling development team.',
      'Earned a $1,500 Keweenaw Community Foundation grant to build a pump track and skills area.',
      'Recruited athletes, secured grassroots sponsorships and supported five athletes to attend USA Cycling mountain bike nationals.',
    ],
  },
];

export const stackAndTools: StackSection[] = [
  {
    title: 'Development Stack and Tools',
    tabLabel: 'Dev Stack',
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
    title: 'Programming & Scripting Languages',
    tabLabel: 'Languages',
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
    tabLabel: 'ETL/API',
    items: ['Data Build Tool (DBT)', 'Django', 'FastAPI', 'Apache Spark (PySpark)'],
  },
  {
    title: 'Databases',
    tabLabel: 'DBs',
    items: ['Redshift', 'PostgreSQL', 'Neo4j'],
  },
  {
    title: 'Services',
    tabLabel: 'Services',
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

export const fallbackGitHubContributions: GitHubContribution[] = [
  { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright' },
  { name: 'JuliaLang/julia', url: 'https://github.com/JuliaLang/julia' },
  { name: 'dbt-labs/dbt-core', url: 'https://github.com/dbt-labs/dbt-core' },
  { name: 'SciML/DifferentialEquations.jl', url: 'https://github.com/SciML/DifferentialEquations.jl' },
];

export const MAX_VISIBLE_CONTRIBUTIONS = 20;
export const MAX_CONTRIBUTION_ENRICHMENTS = 8;
