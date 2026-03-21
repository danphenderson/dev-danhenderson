import type {
  AboutMe,
  CVStoryEndData,
  Certificate,
  CodingExample,
  EducationInfo,
  Experience,
  GitHubActivityItem,
  GitHubContribution,
  VolunteeringEntry,
} from '../types/cv';
import { resolvePublicAssetPath } from '../utils/assets';

const assetPath = (path: string) => resolvePublicAssetPath(path);

export const avatar = assetPath('/assets/home.jpg');
export const cvBackgroundImage = assetPath(
  '/assets/photography/landscape/landscape-tieton-south-fork-3.jpg'
);
export const resumePdfUrl = assetPath('/assets/daniel-henderson-resume.pdf');
export const resumeDownloadFilename = 'Daniel-Henderson-Resume.pdf';

export const githubUsername = 'danphenderson';
export const githubProfileUrl = 'https://github.com/danphenderson';
export const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/';
const mtuMathGraduateBioUrl = 'https://www.mtu.edu/math/graduate/students/';
const mtuGlobalCampusOrganizationUrl =
  'https://www.mtu.edu/globalcampus/programs/degrees/?deliveryOption=online&tags=grad';
export const githubSectionLead =
  'Recent activity, open-source contributions, and contribution history from GitHub.';
export const currentWorkflowTools = [
  'Python',
  'TypeScript',
  'Julia',
  'AWS',
  'React',
  'Docker',
  'GitHub Actions',
];

export const aboutMe: AboutMe = {
  name: 'Daniel Henderson',
  title: 'MS in Applied/Computational Math',
  email: 'me@danhenderson.dev',
  phone: '',
  location: 'Seattle, WA',
  opportunities: ['Scientific computing', 'Data platforms', 'ML/AI engineering'],
  bioLink: {
    text: 'M.S. in applied/computational mathematics',
    url: mtuMathGraduateBioUrl,
    tooltip: 'View the Michigan Tech graduate mathematics student page.',
  },
  bio: `Software developer building scientific, data, and AI-enabled systems. I'm drawn to problems where mathematics meets computation — from modeling blood flow in arteries to building production data pipelines that handle petabytes of healthcare records.

I previously built ingestion, analytics, and ML solutions for a healthcare data platform. Currently pursuing an M.S. in applied/computational mathematics, researching macrocirculatory hemodynamics, and contributing to open-source software.

Outside of work, I engage with side projects that keep me learning and I seek adventure in the mountains to keep me grounded.`,
};

export const codingExamples: CodingExample[] = [
  {
    title: 'typewriter CLI',
    description:
      'Typewriter is a pip-installable CLI built on Typer and LibCST to normalize None-related type annotations while preserving formatting and comments.',
    links: ['https://github.com/danphenderson/python-typewriter'],
    tabs: [
      {
        value: 'purpose',
        label: 'Purpose',
        kind: 'list',
        items: [
          'Normalize `Union[..., None]` and default-`None` annotations across Python source files.',
          'Support dry-run auditing with unified diffs through `typewriter run ... --check`.',
          'Handle file paths, directories, or in-memory snippets via `--code`.',
        ],
      },
      {
        value: 'rewrites',
        label: 'Rewrites',
        kind: 'list',
        items: [
          'Rewrite `Union[T, None]` and related multi-type unions into `Optional[...]` forms.',
          'Upgrade variable and parameter annotations to `Optional[...]` when the default value is `None`.',
          'Add and deduplicate needed typing imports while preserving qualified references.',
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
    description:
      "An asynchronous interface for headless browser automation's that is built on bs4 and selenium.",
    links: ['https://github.com/danphenderson/python-chromex'],
    tabs: [
      {
        value: 'workflow',
        label: 'Workflow',
        kind: 'list',
        items: [
          'Provide an async-oriented interface for browser automation and HTML extraction.',
          'Center the package around reusable browser-driver code, shared base utilities, docs, and tests.',
          'Preserve the project as a reference implementation even though it is marked deprecated in favor of Playwright.',
        ],
      },
      {
        value: 'automation',
        label: 'Automation',
        kind: 'list',
        items: [
          'Use Selenium to drive rendered pages before parsing content with BeautifulSoup.',
          'Bundle supporting automation dependencies such as `webdriver-manager` and `cchardet`.',
          'Ship as an installable `chromex` package targeting Python 3.9+.',
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
    description:
      'An interactive CV, climbing log, and photography galleries built with React + TypeScript + MUI and deployed on AWS using S3, CloudFront, and Route53.',
    links: ['https://github.com/danphenderson/dev-danhenderson'],
    tabs: [
      {
        value: 'product',
        label: 'Product',
        kind: 'list',
        items: [
          'Power a static portfolio with home, CV, climbing, photography index, and album-detail routes.',
          'Store portfolio content in local TypeScript data modules with GitHub-backed CV enrichment when available.',
          'Include resume-style CV sections alongside climbing tick/todo data and photography collections.',
        ],
      },
      {
        value: 'architecture',
        label: 'Architecture',
        kind: 'list',
        items: [
          'Use a React Router SPA with browser-handled routes and `PUBLIC_URL`-compatible asset handling.',
          'Centralize CV animation behavior through shared wrappers and motion tokens instead of per-section timing.',
          'Validate the app with Jest plus Playwright end-to-end tests against a production build.',
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
    description:
      'An optim-style Julia package built with ForwardDiff.jl and TRS.jl that presents a novel scheme for an unconstrained Quasi-Newton minimization of a smooth objective function.',
    links: ['https://github.com/danphenderson/BlockOpt.jl'],
    tabs: [
      {
        value: 'research',
        label: 'Research',
        kind: 'list',
        items: [
          'Package supplemental software for the “QN Optimization with Hessian Samples” work.',
          'Implement a quasi-Newton block update strategy with a direct trust-region subproblem solve.',
          'Pair solver code with docs, tests, and notebooks for numerical experimentation.',
        ],
      },
      {
        value: 'numerics',
        label: 'Numerics',
        kind: 'list',
        items: [
          'Use `ForwardDiff` for derivative information inside the Julia package.',
          'Install alongside a specific `TRS.jl` dependency used by the trust-region solver path.',
          'Organize the implementation around driver, model, options, simulation, and utility modules.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: [
          'Julia',
          'ForwardDiff.jl',
          'TRS.jl',
          'Numerical optimization',
          'Scientific computing',
        ],
      },
    ],
  },
  {
    title: 'UncNLPrograms.jl Julia Package',
    description:
      'A subset of high-dimensional, nonlinear, and unconstrained optimization problems from CUTEst in native Julia to test solvers using Automatic/Algorithmic Differentiation.',
    links: ['https://github.com/danphenderson/UncNLPrograms.jl'],
    tabs: [
      {
        value: 'benchmarks',
        label: 'Benchmarks',
        kind: 'list',
        items: [
          'Provide native Julia implementations of high-dimensional unconstrained test problems drawn from CUTEst.',
          'Expose adjustable problem dimensions and default iterates for solver experiments.',
          'Keep benchmark definitions in `src/programs` behind a shared package interface.',
        ],
      },
      {
        value: 'solver-use',
        label: 'Solver Use',
        kind: 'list',
        items: [
          'Expose `Programs`, `SelectProgram`, `adjdim!`, `obj`, `grad`, `objgrad`, and `hessAD` as the main workflow.',
          'Support gradient and Hessian evaluation with `ForwardDiff` in Julia-native experiments.',
          'Position the package as a lightweight benchmark set inspired by `NLPModels`.',
        ],
      },
      {
        value: 'stack',
        label: 'Stack',
        kind: 'skills',
        skills: [
          'Julia',
          'CUTEst-style benchmarks',
          'Automatic differentiation',
          'Nonlinear optimization',
          'Scientific computing',
        ],
      },
    ],
  },
  {
    title: 'MasterPlan Java Application',
    description:
      'A Java application that allows users to create and manage a structure (directed acyclic graph) of tasks and corresponding subtasks.',
    links: ['https://github.com/danphenderson/masterplan-app'],
    tabs: [
      {
        value: 'planning',
        label: 'Planning',
        kind: 'list',
        items: [
          'Build a desktop planning app as a multi-module Maven project with separate `ui` and `infrastructure` modules.',
          'Launch a JavaFX application from `MainApp` into a dedicated `MainView.fxml` shell.',
          'Organize the UI around workspaces, categories, tags, archives, and account flows.',
        ],
      },
      {
        value: 'model',
        label: 'Model',
        kind: 'list',
        items: [
          'Target Java 11+, OpenJFX 16, JUnit 4, and Maven 3 for development and packaging.',
          'Produce a shaded runnable JAR for the UI module through the Maven Shade plugin.',
          'Use Java module boundaries so `io.masterplan.ui` depends on `io.masterplan.infrastructure`.',
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
    companyUrl: mtuGlobalCampusOrganizationUrl,
    companyTooltip: 'View online graduate degrees page',
    industry: 'Higher Education',
    title: 'Graduate Research Assistant',
    startDate: 'May 2025',
    endDate: 'Current',
    description: [
      {
        text: 'Researching blood-flow and transport models governed by Navier–Stokes and convection-diffusion PDEs using traditional numerical and machine-learning approaches.',
      },
      {
        text: ' Advisor: ',
        lineBreakBefore: false,
      },
      {
        text: 'Jiguang Sun',
        link: 'https://pages.mtu.edu/~jiguangs/Homepage_of_Jiguang_Sun/Welcome.html',
        tooltip: 'View faculty page',
      },
    ],
    projects: [
      'Formalized continuum mechanics foundations to derive vascular flow conservation laws (Eulerian and Lagrangian).',
      'Derived and analyzed Navier–Stokes formulations for blood (including Newtonian and generalized-Newtonian viscosity models), documenting the kinematic roles of Reynolds/Womersley numbers and related nondimensional parameters.',
      'Scoped numerical pathways from dimension-reduced 1D/2D flow simulations incorporating fluid-structure interaction models toward PINNs/DeepONets.',
    ],
    skills: [
      'Research',
      'Computational Fluid Dynamics',
      'Julia',
      'Python',
      'DeepXDE',
      'SciML',
      'SciPy',
      'LaTeX',
      'Overleaf + GitHub',
      'Visual Studio Code',
      'Jupyter',
      'Shell scripting',
    ],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuGlobalCampusOrganizationUrl,
    companyTooltip: 'View online graduate degrees page',
    industry: 'Higher Education',
    title: 'Instructor',
    startDate: 'Jan 2025',
    endDate: 'May 2025 (5 mos)',
    description:
      'Department of Mathematical Sciences Graduate Teaching Assistantship instructor of Calculus I with Technology',
    projects: [
      'Taught a 4-credit undergraduate mathematics section, delivering recorded lectures, proctoring exams, holding office hours, and managing grading and day-to-day course operations.',
      'Delivered lecture material consistently and on schedule, maintaining alignment with the course coordinator’s instructional plan.',
      'Coordinated content, rubrics, and student support across recitations with supervising faculty and peer instructors to maintain consistency across sections.',
      'Developed Mathematica notebook walkthroughs that reinforced conceptual understanding and computational fluency.',
      'Earned a 4.8/5.0 average student evaluation score with a 58% response rate, above the university average.',
    ],
    skills: [
      'University Teaching',
      'Canvas',
      'Gradescope',
      'Panapto',
      'Zoom',
      'Mathematica',
      'HTML',
    ],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuGlobalCampusOrganizationUrl,
    companyTooltip: 'View online graduate degrees page',
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
    companyTooltip: 'View company site',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer',
    startDate: 'Apr 2022',
    endDate: 'Dec 2022 (9 mos)',
    description:
      'Owned data ingestion, transformation, and infrastructure for a multi-tenant healthcare analytics platform. Focused on pipeline performance, cost optimization, and infrastructure-as-code maturity while navigating a rapid organizational transition.',
    projects: [
      "Supported architectural design, releases, and deployments of data-engineering assets, including data governance, security, and integrity of the platform's data lakehouse.",
      'Repartitioned 50TB datalake, yielding improved query performance to accelerate nightly DBT builds and support analytics and reporting.',
      'Reduced AWS ETL cost by 50% from upgrading ETL jobs to Glue 3.0 and moving batch workloads to EMR on transient EC2 fleets, supported by an internal platform library for provisioning, networking, security, monitoring, and scaling EMR clusters.',
      'Built a reconciliation service across PostgreSQL, AWS Glue Data Catalog, Redshift, and S3 to identify and resolve data inconsistencies, reducing tenant-state investigations from hours to minutes.',
      'Centralized infrastructure delivery   by building an internal CDK library through a major refactor that removed technical debt and git submodules, while introducing semantic versioning practices, enabling more reliable and efficient deployments.',
      'Migrated data team’s software assets from Bitbucket to GitHub Enterprise, standardizing CI/CD into GitHub Actions and hooks.',
      'Processed AWS CloudTrail logs into Parquet and built a dashboard to support security analytics and HITRUST compliance.',
      'Supported hiring and onboarding during an organizational transition, including new engineering and data leadership and interns, and helped ensure continuity through a reorganization that included my departure.',
    ],
    skills: [
      'AWS: EC2, S3, SNS, SQS, Cloudformation, Cloudtrail, Cloudwatch, Lambda, Glue (& Glue Data Catalog), EMR, Redshift, RDS, Athena, Quicksight',
      'AWS CDK',
      'Python',
      'PySpark',
      'Jupyter',
      'DBT (Data Build Tool)',
      'GitHub Enterprise',
      'GitHub Actions',
      'Docker',
      'Sentry',
      'Slack',
      'SonarCloud',
      'Django',
      'OpenAPI/Swagger',
      'DBeaver',
      'Postman',
      'Visual Studio Code',
    ],
  },
  {
    company: 'Lucerna Health',
    companyUrl: 'https://getlucerna.com',
    companyTooltip: 'View company site',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'Nov 2021',
    endDate: 'Apr 2022 (6 mos)',
    description:
      'Built production ML and analytics capabilities for a multi-tenant healthcare data platform — from anomaly detection pipelines to CI/CD for model artifacts. Bridged data science and data engineering, often serving as the connecting layer between ML research and production systems.',
    projects: [
      'Introduced CI/CD for machine-learning code, infrastructure, and model artifacts with AWS CDK and Bitbucket Pipelines, safeguarding our workflows and streamlining deployment processes.',
      'Developed a schema-agnostic anomaly-detection pipeline and presented the workflow for broader team adoption, using PySpark isolation forest models to identify outliers in the platform`s S3 data lake.',
      'Built an internal ML library that standardized training, deployment, logging, and cloud configuration, enabling portable ML workflows.',
      'Contributed to a deduplication model with a human-in-the-loop training loop driven by platform user feedback.',
      'Supported restricted offshore data engineers with deployments, code review, ETL troubleshooting, and unit tests to accelerate delivery.',
      'Migrated patient electronic medical record data from a client system into the platform, supporting schema mapping, ingestion, and validation.',
    ],
    skills: [
      'AWS',
      'AWS CDK',
      'Python',
      'Jupyter',
      'DBT (Data Build Tool)',
      'Bitbucket',
      'Bitbucket Pipelines',
      'SciPy',
      'PySpark',
      'Visual Studio Code',
      'DBeaver',
      'Slack',
      'Sentry',
      'Jira',
      'Confluence',
      'Lucidchart',
    ],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuGlobalCampusOrganizationUrl,
    companyTooltip: 'View online graduate degrees page',
    industry: 'Higher Education',
    title: 'Research Assistant | Full Time',
    startDate: 'May 2021',
    endDate: 'Nov 2021 (7 mos)',
    description:
      'Led numerical experiments for quasi-Newton optimization research that resulted in a published pre-print paper (Azzam, Henderson, Ong, Struthers; 2022). Designed and implemented the software artifacts in Julia, combining trust-region methods with automatic differentiation to solve high-dimensional unconstrained optimization problems.',
    projects: [
      [
        { text: '2022, Azzam J, Henderson D, Ong BW, and Struthers AA, ' },
        {
          text: 'Quasi-Newton Optimization with Hessian Samples',
          link: 'https://lnkd.in/gfP39wZX',
        },
      ],
      [
        { text: 'Built ' },
        { text: 'BlockOpt.jl', link: 'https://github.com/danphenderson/BlockOpt.jl' },
        {
          text: ', an open-source Julia implementation of the paper’s trust-region quasi-Newton methods.',
        },
      ],
      [
        { text: 'Built ' },
        { text: 'UncNLPrograms.jl', link: 'https://github.com/danphenderson/UncNLPrograms.jl' },
        {
          text: ' to create an automatic-differentiation optimization benchmark suite to test paper’s methods.',
        },
      ],
    ],
    skills: [
      'Research',
      'Julia',
      'ForwardDiff.jl',
      'CUTEst',
      'LaTeX',
      'TRS.jl',
      'Mathematica',
      'Overleaf',
    ],
  },
  {
    company: 'Michigan Technological University',
    companyUrl: mtuGlobalCampusOrganizationUrl,
    companyTooltip: 'View online graduate degrees page',
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'September 2015',
    endDate: 'May 2018 (2 yrs 9 mos)',
    description:
      'Tutor to NCAA student-athletes in calculus (I, II, & III), ordinary differential equations, and linear algebra.',
    projects: [],
    skills: ['Teaching', 'Mathematica'],
  },
  {
    company: 'Various Locations',
    industry: 'Retail & Service',
    title: 'Bike Mechanic & Service Technician',
    startDate: 'Various Periods Starting 2012',
    endDate: 'Aug 2024',
    description:
      'Worked full-time and part-time at bike and ski shops in Arizona, Michigan, Utah, & Washington.',
    projects: [
      'Diagnosed and serviced mechanical issues across customer and rental bicycles with consistent turnaround and quality.',
      'Managed end-to-end service and sale workflows in retail and rental environments, including intake, triage, repair prioritization, point-of-sale transactions, rental check-in/check-out, and insurance claim support.',
      'Applied structured troubleshooting and clear customer communication to recommend repairs, explain technical issues, and improve rider safety, equipment reliability, and overall service experience.',
    ],
    skills: ['Lightspeed', 'Customer Service'],
  },
];

export const educationInfo: EducationInfo = {
  entries: [
    {
      university: 'Michigan Technological University',
      program: 'MS Mathematics, Applied/Computational',
      summary:
        'Graduate studies in applied/computational mathematics, while research bridges classical fluid dynamics with scientific machine learning.',
      dateRange: 'Fall 2024 – Present',
      expectedCompletion: 'Expected Summer 2026',
      gpa: [{ label: 'Cumulative', value: '3.44' }],
      highlights: [
        'Pedagogical training in curriculum design, assessment, and evidence-based instruction.',
        'Submissions to Numerical Analysis: A Graduate Course errata, improving correctness and clarity in the text.',
        'Coursework: Linear Algebra, Numerical Optimization, Error-Correcting Codes, Theoretical Numerical Analysis, Ordinary Differential Equations, Partial Differential Equations, Numerical Methods for PDEs, Discontinuous Galerkin Methods, Teaching College Mathematics',
      ],
      skills: ['LaTeX', 'Julia', 'Python', 'Mathematica', 'Overleaf', 'Visual Studio Code'],
    },
    {
      university: 'Michigan Technological University',
      program: 'B.S. Cum Laude, Mathematics, Applied/Computational',
      summary:
        'Applied/computational mathematics degree paired with a computer science minor, spanning scientific computing, algorithms, and systems programming. Complemented by extensive campus leadership in student government, finance, and athletics.',
      minor: 'Computer Science',
      gpa: [
        { label: 'Cumulative', value: '3.56' },
        { label: 'Departmental', value: '3.71' },
      ],
      highlights: [
        'President & V.P., Finance Club',
        'Representative, Undergraduate Student Government',
        'Member, Ways and Means Committee, allocating $700K to 220 student organizations',
        "Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K",
        'Student Advisor to the Dean of the School of Business and Economics',
        'Junior Partner, Applied Portfolio Management Program ($1.8M AUM)',
        "Recipient of Dean's List award for six semesters (Spring 2015, Summer 2015, Fall 2019, Spring 2020, Fall 2020, & Spring 2021)",
        'Certificate of Merit for Outstanding Academic Achievement in Calculus II with Technology, Mathematical Sciences Department',
        'Relevant Coursework: Scientific Computing, Programming at Software & Hardware interface, Data Structures, Formal Models of Computation, Artificial Intelligence, Concurrent Computing, Optimization & Graph Algorithms, Team Software Project, Real Analysis (I & II), Abstract Algebra, Complex Analysis, Linear Algebra, Numerical Linear Algebra, Ordinary Differential Equations, Partial Differential Equations (PDEs), Numerical Methods for PDEs, Nonlinear Dynamics and Chaos, Combinatorics, Probability, Statistics (I & II), Regression Analysis, History of Mathematics',
      ],
      skills: ['Java', 'C', 'C++', 'Python', 'Matlab', 'Mathematica', 'SQL', 'Assembly (MIPS)'],
    },
  ],
};

export const volunteering: VolunteeringEntry[] = [
  {
    organization: 'Little Brothers',
    organizationUrl: 'https://lbfenetwork.org',
    organizationTooltip: 'View organization site',
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
    organizationTooltip: 'View organization site',
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

export const fallbackGitHubActivity: GitHubActivityItem[] = [
  {
    label: 'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).',
    href: 'https://github.com/danphenderson/BlockOpt.jl',
  },
  {
    label: 'Experimenting with data/ML pipelines on AWS Glue, EMR, and CDK.',
    href: 'https://github.com/danphenderson',
  },
  {
    label: 'Shipping personal portfolio + CV site (React, TypeScript, AWS).',
    href: 'https://github.com/danphenderson/dev-danhenderson',
  },
];

export const fallbackGitHubContributions: GitHubContribution[] = [
  { name: 'microsoft/playwright', url: 'https://github.com/microsoft/playwright' },
  { name: 'JuliaLang/julia', url: 'https://github.com/JuliaLang/julia' },
  { name: 'dbt-labs/dbt-core', url: 'https://github.com/dbt-labs/dbt-core' },
  {
    name: 'SciML/DifferentialEquations.jl',
    url: 'https://github.com/SciML/DifferentialEquations.jl',
  },
];

export const MAX_VISIBLE_CONTRIBUTIONS = 20;
export const MAX_CONTRIBUTION_ENRICHMENTS = 8;

// ── Story-mode metadata ──────────────────────────────────────────────

export const cvStoryIntro =
  'A guided walk through my career — from mathematics through scientific computing to full-stack engineering and open-source work.';

export const cvStoryEndData: CVStoryEndData = {
  headline: "Let's Connect",
  body: "Thanks for reading. Whether you're interested in scientific computing, data engineering, open-source collaboration, or just want to say hello — I'd love to hear from you.",
  channels: [
    { label: 'me@danhenderson.dev', url: 'mailto:me@danhenderson.dev', icon: 'email' },
    { label: 'GitHub', url: githubProfileUrl, icon: 'github' },
    { label: 'LinkedIn', url: linkedinProfileUrl, icon: 'linkedin' },
    { label: 'danhenderson.dev', url: 'https://danhenderson.dev', icon: 'web' },
  ],
};

export const cvStoryCta = {
  switchToDefault: 'Switch to full CV',
  switchToStory: 'Read my story',
} as const;
