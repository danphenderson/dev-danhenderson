import { Typography,Grid, Paper, Box, Button, Divider } from '@mui/material';
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
  },
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "January 19th, 2024",
  }
]

const experiences = [
  {
    company: 'Lucerna Health',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer | Full Time',
    startDate: 'April 2022',
    endDate: 'December 2023',
    description: "Led software development and research of cloud warehousing and ingestion solutions for Lucerna's big-data cloud platform. Responsibilities included architectural design, releases, and deployments of the platform's data-engine software assets, ensuring the security and integrity of our clients' analytics data layer.",
    projects: [
      "Built backend service to administer a platform's data lake, such as replicating, repartitioning, and casting datatypes, to drive versioning in the platform's Data Catalog Designer application by abstracting data lake CRUD operations to ensure data integrity/consistency throughout our systems.",
      "Centralized Infrastructure deployment plane by creating a standard cloud development kit, an internal python library of common constructs, CloudFormation Templates, and Amazon CDK Stacks with a CLI to bootstrap, deploy and destroy infrastructure and resources in a platform's AWS environment.",
      "Utilized EC2 instance fleets and transient EMR workloads to cut cloud compute costs by abstracting a cluster's autoscaling, configuration/bootstrapping, provisioning, security, and networking concerns into a common library.",
      "Designed and developed our Consumer Profile Service graph solution using Amazon Neptune and Apache Gremlin to drive consumer acquisition and engagement insights for omnichannel marketing campaigns.",
    ],
  },
  {
    company: 'Lucerna Health',
    industry: 'HealthTech',
    title: 'Data Scientist | Contract',
    startDate: 'November 2021',
    endDate: 'April 2022',
    description: "ML feature development, operations, and assisted three restricted-offshore developers by rapidly resolving blockers, e.g. infrastructure deployments, code reviews, ETL services, and QA testing to accelerate their productivity.",
    projects: [
      "Built analytics pipeline and dashboard to meet data governance auditory requirements for the HiTrust certification of the organization's multi-tenant cloud architecture.",
      "Introduced standard version control safeguards for our data-science department production assets and automated their deployment using AWS CDK and Bitbucket pipelines.",
      "Collaborated on an ML hook into the platform's ingestion pipeline to detect record duplicates during batch ingestion; using the python dedupe library, I built an asynchronous interface around the human-augmented training of the model.",
    ],
  },
  {
    company: 'Michigan Technological University',
    industry: 'Higher Education',
    title: 'Researcher | Internship',
    startDate: 'November 2021',
    endDate: 'April 2022',
    description: "Responsibilities included co-authoring and performing the numerical experiment for submission to SIAM’s 2022 conference on Parallel Processing for Scientific Computing of publication: 2022, Azzam J, Henderson D, Ong BW and Struthers AA, Quasi-Newton Optimization with Hessian Samples.",
    projects: [
      "Built BlockOpt.jl, an optim-style interface built on top of ForwardDiff.jl and TRS.jl Julia packages implementing Algorithm 7.1 in publication.",
      "Built UncNLPrograms.jl, a library containing a subset of high-dimensional, nonlinear, and unconstrained optimization problems from the CUTEst set implemented in native Julia to test solvers using Automatic/Algorithmic Differentiation.", 
    ],
  },
  {
    company: 'Michigan Technological University',
    industry: 'Higher Education',
    title: 'Mathematics Tutor | Part Time',
    startDate: 'November 2021',
    endDate: 'April 2022',
    description: "Provided weekly tutoring services to NCAA student-athletes in multivariable, integral and differential calculus, ordinary differential equations, and linear algebra.",
    projects: [
    ],
  },
  // Add more experiences as needed
];

const githubProfileUrl = 'https://github.com/danphenderson'; // Replace with your GitHub profile URL

const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/'; // Replace with your LinkedIn profile URL

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
      'LaTeX',
      'HTML',
      'TypeScript',
    ],
  },
  {
    title: 'CLI Tools',
    items: [
      'Amazon CDK & SDK',
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
    items: ['DBT', 'Django', 'FastAPI', 'React', 'Apache Spark'],
  },
  {
    title: 'Databases',
    items: ['Redshift', 'PostgreSQL', 'Amazon Neptune'],
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
  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-tieton-south-fork-3.jpg'>
      {/* Left Section (Profile Section) */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ padding: 2, textAlign: "center", marginY: 4 }}>
          {/* Name and Title */}
          <Typography variant="h4">{aboutMe.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{aboutMe.title}</Typography>
          <Box>
            <Box sx={{ my: 2 }}>
              <Button variant="contained" color="primary" href={githubProfileUrl} target="_blank" startIcon={<GitHubIcon />}>
                GitHub Profile
              </Button>
            </Box>
            <Box sx={{ my: 2 }}>
              <Button variant="contained" color="primary" href={linkedinProfileUrl} target="_blank" startIcon={<LinkedInIcon />}>
                LinkedIn Profile
              </Button>
            </Box>
          </Box>
         {/* Stack and Tools */}
          {/* <Box sx={{ padding: 2 }}>
            {stackAndTools.map((section) => (
                <Box key={section.title}>
                  <Typography variant="h5" gutterBottom>{section.title}</Typography>
                <List dense>
                  {section.items.map((item) => (
                    <ListItem key={item}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Box> */}
        </Paper>
      </Grid>

      {/* Right Section */}
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ padding: 2, marginY: 4 }}>


          {/* Experience */}
          <Box sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h3" gutterBottom > Experiences</Typography>
            {experiences.map((experience, index) => (
              <Box key={index}>
                <Typography variant="h5">{experience.title} @ {experience.company}</Typography>
                <Typography variant="subtitle1" color="textSecondary">{experience.startDate} - {experience.endDate}</Typography>
                <Typography variant="body1">{experience.description}</Typography>
                <Divider sx={{ margin: "10px 0" }} />
              </Box>
            ))}
          </Box>


          {/* Certificates */}
          <Box sx={{ padding: 2, marginBottom: 4 }}>
            <Typography variant="h3" gutterBottom > Certificates</Typography>
            {certificates.map((certificate, index) => (
              <Box key={index}>
                <Typography variant="h5">{certificate.title} </Typography>
                <Typography variant="subtitle1" color="textSecondary">{certificate.issuer} issued on {certificate.date}</Typography>
                <Divider sx={{ margin: "10px 0" }} />
              </Box>
            ))}
          </Box>


        {/* Education */}
        <Box sx={{ padding: 2, marginBottom: 4 }}>
          <Typography variant="h3" gutterBottom> Education</Typography>
          <Typography variant="h5">{educationInfo.university}</Typography>
          <Typography variant="subtitle1">{educationInfo.degree}</Typography>
          <Typography variant="subtitle1">{educationInfo.grades}</Typography>

          {/* Activities */}
          {educationInfo.activities.split("\n").map((activity, index) => (
            <Typography key={index} variant="body1">{activity}</Typography>
          ))}
          {/* Achievements */}
          {educationInfo.achievements.split("\n").map((acheivement, index) => (
            <Typography key={index} variant="body1">{acheivement}</Typography>
          ))}
          <Divider sx={{ margin: "10px 0" }} />
        </Box>


        {/* Coding Examples */}
        <Box sx={{ padding: 2, marginBottom: 4 }}>
          <Typography variant="h3" gutterBottom> Coding Examples</Typography>
          {codingExamples.map((example, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography variant="h5">{example.title}</Typography>
              <Typography variant="body1">{example.description}</Typography>
              {example.links.map((link, linkIndex) => (
                <Typography key={linkIndex} variant="body2">
                  <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      </Paper>
      </Grid> 
    </BackgroundPaper>
  );
}