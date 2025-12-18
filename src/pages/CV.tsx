import { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Button, Divider, Avatar, Chip, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BackgroundPaper from '../components/BackgroundPaper';


const avatar = "./assets/home.jpg";

const aboutMe = {
  name: 'Daniel Henderson',
  title: 'Software Engineer',
  email: 'me@danhenderson.dev',
  phone: '906-281-7641',
  location: 'Seattle, WA',
  bio: `Applied/Computational Mathematics PhD student at Michigan Technological University (expected M.S. Spring 2026), building performance-critical scientific software and data systems.

Previously, I was a data scientist and pipeline engineer at Lucerna Health, where I designed cloud-native ingestion and analytics infrastructure that increased throughput by 50%+ and reduced downstream compute costs. That industry experience informs my research and engineering style: correctness first, then performance, then maintainability and reproducibility.

Current research focuses on numerical methods for differential equations in hemodynamics, with additional work in smooth optimization and performance benchmarking across Julia, Python, and C. I'm pursuing applied research and engineering roles at the intersection of math, systems, and production software (scientific computing, data platforms, ML/AI engineering).`,
};

const accentColor = '#0ea5e9';
const glassPanelSx = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)',
  border: '1px solid rgba(255,255,255,0.65)',
  boxShadow: '0 20px 80px rgba(15,23,42,0.18)',
  backdropFilter: 'blur(12px)',
};

const githubUsername = 'danphenderson';
const fallbackGitHubActivity = [
  'Maintaining BlockOpt.jl (trust-region quasi-Newton optimizer in Julia).',
  'Experimenting with data/ML pipelines on AWS Glue, EMR, and CDK.',
  'Shipping personal portfolio + CV site (React, TypeScript, AWS).',
];
const fallbackGitHubProjects = [
  { name: 'BlockOpt.jl', url: 'https://github.com/danphenderson/BlockOpt.jl' },
  { name: 'UncNLPrograms.jl', url: 'https://github.com/danphenderson/UncNLPrograms.jl' },
  { name: 'python-chromex', url: 'https://github.com/danphenderson/python-chromex' },
  { name: 'masterplan-app', url: 'https://github.com/danphenderson/masterplan-app' },
];

type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at?: string;
  payload?: {
    action?: string;
    ref_type?: string;
    ref?: string;
    commits?: { message?: string }[];
    pull_request?: { number?: number };
    issue?: { number?: number };
  };
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
};

const formatGitHubEvent = (event: GitHubEvent) => {
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload?.commits?.length ?? 0;
      return `Pushed ${commits || 'new'} commit${commits === 1 ? '' : 's'} to ${event.repo.name}`;
    }
    case 'PullRequestEvent': {
      const action = event.payload?.action ?? 'updated';
      const prNumber = event.payload?.pull_request?.number;
      return `${action.charAt(0).toUpperCase()}${action.slice(1)} PR${prNumber ? ` #${prNumber}` : ''} on ${event.repo.name}`;
    }
    case 'IssuesEvent': {
      const action = event.payload?.action ?? 'updated';
      const issueNumber = event.payload?.issue?.number;
      return `${action.charAt(0).toUpperCase()}${action.slice(1)} issue${issueNumber ? ` #${issueNumber}` : ''} on ${event.repo.name}`;
    }
    case 'PullRequestReviewEvent':
      return `Reviewed a PR on ${event.repo.name}`;
    case 'CreateEvent':
      return `Created ${event.payload?.ref_type ?? 'a resource'}${event.payload?.ref ? ` ${event.payload.ref}` : ''} in ${event.repo.name}`;
    case 'ReleaseEvent':
      return `Published a release on ${event.repo.name}`;
    default:
      return `${event.type.replace(/Event$/, '')} on ${event.repo.name}`;
  }
};


const codingExamples = [
  {
    title: 'chromex',
    description: "An asynchronous interface for chrome browser automation's and scrapping that is built on bs4 and selenium.",
    links: ['https://github.com/danphenderson/python-chromex'],
  },
  {
    title: 'Portfolio',
    description: 'My personal portfolio website built with React-TypeScript, using Material UI 5. It is deployed on AWS using S3, CloudFront, and Route53.',
    links: ['https://danhenderson.dev',],
  },
  {
    title: 'BlockOpt.jl',
    description: 'An optim-style interface built on top of ForwardDiff.jl and TRS.jl Julia packages exploring a novel scheme for an unconstrained Quasi-Newton minimization of a smooth objective function.',
    links: ['https://github.com/danphenderson/BlockOpt.jl'],
  },
  {
    title: 'UncNLPrograms.jl',
    description: 'A library containing a subset of high-dimensional, nonlinear, and unconstrained optimization problems from the CUTEst set implemented in native Julia to test solvers using Automatic/Algorithmic Differentiation.',
    links: ['https://github.com/danphenderson/UncNLPrograms.jl']
  },
  {
    title: 'MasterPlan',
    description: 'A java application that allows users to create and manage a DAG structure of tasks and corresponding subtasks. It was built using Maven, Java11, and JavaFX.',
    links: ['https://github.com/danphenderson/masterplan-app']
  },
  {
    title: 'LeetCode Solutions',
    description: "A collection of my solutions to LeetCode problems.",
    links: ['https://github.com/danphenderson/leetcode-solutions']
  },
]

const certificates = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "Feburary 5th, 2024",
    link: "/assets/aws-soln-architect-cert.pdf",
  },
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "January 19th, 2024",
    link: "/assets/aws-cloud-practitioner-cert.pdf",
  }
]

const experiences = [
  {
    company: 'Lucerna Health',
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
    description: "Provided weekly tutoring services to NCAA student-athletes in multivariable, integral and differential calculus, ordinary differential equations, and linear algebra.",
    projects: [
    ],
  },
  // Add more experiences as needed
];

const githubProfileUrl = 'https://github.com/danphenderson'; 

const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/'; 

const educationInfo = {
  university: "Michigan Technological University",
  degree: "B.S. Cum Laude, Mathematics, Applied/Computational & Minor in Computer Science",
  grades: "Cumulative: 3.56 | Departmental: 3.71",
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


const stackAndTools = [
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


export default function CV() {
  const [githubActivity, setGithubActivity] = useState<string[]>(fallbackGitHubActivity);
  const [githubProjects, setGithubProjects] = useState<{ name: string; url: string }[]>(fallbackGitHubProjects);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchGitHub = async () => {
      setGithubLoading(true);
      setGithubError(null);
      try {
        const [eventsRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}/events/public?per_page=20`, {
            headers: { Accept: 'application/vnd.github+json' },
          }),
          fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github+json' },
          }),
        ]);

        let encounteredError = false;

        if (eventsRes.ok) {
          const eventsData: GitHubEvent[] = await eventsRes.json();
          const formattedEvents = eventsData
            .filter((event) =>
              ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'PullRequestReviewEvent', 'CreateEvent', 'ReleaseEvent'].includes(event.type)
            )
            .map(formatGitHubEvent)
            .filter(Boolean)
            .slice(0, 6);
          if (!cancelled) {
            setGithubActivity(formattedEvents.length ? formattedEvents : fallbackGitHubActivity);
          }
        } else {
          encounteredError = true;
          if (!cancelled) {
            setGithubActivity(fallbackGitHubActivity);
          }
        }

        if (reposRes.ok) {
          const reposData: GitHubRepo[] = await reposRes.json();
          const repos = reposData
            .filter((repo) => !repo.fork && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 8)
            .map((repo) => ({ name: repo.name, url: repo.html_url }));
          if (!cancelled) {
            setGithubProjects(repos.length ? repos : fallbackGitHubProjects);
          }
        } else {
          encounteredError = true;
          if (!cancelled) {
            setGithubProjects(fallbackGitHubProjects);
          }
        }

        if (encounteredError && !cancelled) {
          setGithubError('Unable to load GitHub activity right now. Showing recent highlights instead.');
        }
      } catch (error) {
        if (!cancelled) {
          setGithubError('Unable to load GitHub activity right now. Showing recent highlights instead.');
          setGithubActivity(fallbackGitHubActivity);
          setGithubProjects(fallbackGitHubProjects);
        }
      } finally {
        if (!cancelled) {
          setGithubLoading(false);
        }
      }
    };

    fetchGitHub();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-tieton-south-fork-3.jpg'>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...glassPanelSx,
                height: '100%',
                p: { xs: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                borderRadius: 3,
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Avatar
                  src={avatar}
                  alt={aboutMe.name}
                  sx={{
                    width: 96,
                    height: 96,
                    boxShadow: '0 10px 30px rgba(15,23,42,0.3)',
                    border: '2px solid rgba(255,255,255,0.9)',
                  }}
                />
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight={700}>
                    {aboutMe.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {aboutMe.title}
                  </Typography>
                </Box>
                <Chip
                  label={aboutMe.location}
                  variant="outlined"
                  sx={{
                    borderColor: accentColor,
                    color: '#0f172a',
                    backgroundColor: 'rgba(14,165,233,0.12)',
                    fontWeight: 600,
                  }}
                />
              </Stack>

              {aboutMe.bio && (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: '#0f172a' }}>
                  {aboutMe.bio}
                </Typography>
              )}

              <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    GitHub
                  </Typography>
                  <Stack spacing={1.25} sx={{ mt: 1 }}>
                    <Button
                      variant="text"
                      color="primary"
                      href={githubProfileUrl}
                      target="_blank"
                      startIcon={<GitHubIcon />}
                      sx={{ textTransform: 'none', alignSelf: 'flex-start', paddingX: 0 }}
                    >
                      View profile
                    </Button>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#0f172a', mb: 0.5 }}>
                        Recent activity
                      </Typography>
                      {githubLoading ? (
                        <Typography variant="body2" color="text.secondary">
                          Loading activity...
                        </Typography>
                      ) : (
                        <Box component="ul" sx={{ paddingLeft: 2.5, margin: 0 }}>
                          {githubActivity.map((item, idx) => (
                            <Typography key={idx} component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                              {item}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {githubError && (
                        <Typography variant="caption" color="textSecondary">
                          {githubError}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#0f172a', mb: 0.5 }}>
                        Open source projects
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {githubProjects.map((project) => (
                          <Chip
                            key={project.name}
                            label={project.name}
                            component="a"
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(15,23,42,0.12)',
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              fontWeight: 600,
                              color: '#0f172a',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    Stack & Tools
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1 }}>
                    {stackAndTools.map((section) => (
                      <Box key={section.title}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f172a', mb: 0.5 }}>
                          {section.title}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.75,
                          }}
                        >
                          {section.items.map((item) => (
                            <Chip
                              key={item}
                              label={item}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: 'rgba(15,23,42,0.12)',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                ...glassPanelSx,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 3,
              }}
            >
              <Stack spacing={3.5}>
                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    Experience
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2, color: '#0f172a' }}>
                    Roles & Impact
                  </Typography>
                  <Stack spacing={2.25}>
                    {experiences.map((experience, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: 2,
                          border: '1px solid rgba(14,165,233,0.18)',
                          backgroundColor: 'rgba(255,255,255,0.78)',
                          boxShadow: '0 10px 40px rgba(15,23,42,0.08)',
                          p: { xs: 2, md: 2.5 },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                          <Box>
                            <Typography variant="h6" fontWeight={700}>
                              {experience.title} @ {experience.company}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                              {experience.startDate} - {experience.endDate}
                            </Typography>
                          </Box>
                          {experience.industry && (
                            <Chip
                              size="small"
                              label={experience.industry}
                              variant="outlined"
                              sx={{
                                borderColor: accentColor,
                                color: '#0f172a',
                                backgroundColor: 'rgba(14,165,233,0.12)',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Stack>
                        {experience.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {experience.description}
                          </Typography>
                        )}
                        {experience.projects && experience.projects.length > 0 && (
                          <Box component="ul" sx={{ paddingLeft: 3, margin: '10px 0' }}>
                            {experience.projects.map((project, projectIndex) => {
                              if (typeof project === 'string') {
                                return (
                                  <Typography component="li" variant="body2" key={projectIndex}>
                                    {project}
                                  </Typography>
                                );
                              }

                              return (
                                <Typography component="li" variant="body2" key={projectIndex}>
                                  {project.text}
                                  {project.link && (
                                    <>
                                      {' '}
                                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                                        {project.link}
                                      </a>
                                    </>
                                  )}
                                </Typography>
                              );
                            })}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    Certificates
                  </Typography>
                  <Stack spacing={1.5}>
                    {certificates.map((certificate, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: 2,
                          border: '1px solid rgba(15,23,42,0.08)',
                          padding: 2,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        <Typography variant="h6">{certificate.title}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                          {certificate.issuer} issued on {certificate.date}
                        </Typography>
                        {certificate.link && (
                          <Button
                            href={certificate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, textTransform: 'none' }}
                          >
                            View Certificate
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    Education
                  </Typography>
                  <Typography variant="h4" sx={{ mb: 2, color: '#0f172a' }}>
                    {educationInfo.university}
                  </Typography>
                  <Typography variant="subtitle1">{educationInfo.degree}</Typography>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1.5 }}>
                    {educationInfo.grades}
                  </Typography>
                  <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                    {educationInfo.activities.split("\n").map((activity, index) => (
                      <Typography key={index} variant="body2">
                        {activity}
                      </Typography>
                    ))}
                  </Stack>
                  <Stack spacing={0.5}>
                    {educationInfo.achievements.split("\n").map((acheivement, index) => (
                      <Typography key={index} variant="body2">
                        {acheivement}
                      </Typography>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <Typography variant="overline" sx={{ color: accentColor, letterSpacing: 2, fontWeight: 700 }}>
                    Coding Examples
                  </Typography>
                  <Stack spacing={1.5}>
                    {codingExamples.map((example, index) => (
                      <Box key={index} sx={{ borderRadius: 2, padding: 1.5, backgroundColor: 'rgba(255,255,255,0.78)' }}>
                        <Typography variant="h6">{example.title}</Typography>
                        <Typography variant="body2">{example.description}</Typography>
                        <Stack spacing={0.25} sx={{ mt: 0.5 }}>
                          {example.links.map((link, linkIndex) => (
                            <Typography key={linkIndex} variant="body2">
                              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPaper>
  );
}
