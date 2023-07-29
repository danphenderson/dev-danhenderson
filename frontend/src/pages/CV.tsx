import { Typography,Grid, Paper, Box,  Avatar, Button, Divider, ListItem, ListItemText, List } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const avatar = "./assets/home.jpg";

const aboutMe = {
  name: 'Daniel Henderson',
  title: 'Software Engineer',
  email: 'me@danhenderson.dev',
  phone: '906-281-7641',
  location: 'Seattle, WA',
  about:
    "As a Cloud Data Platform Engineer with 1.5 years of experience, I am passionate about leading big-data solutions and driving analytics and insights for growth-oriented organizations prioritizing developer experience using CI/CD automation and cloud infrastructure defined as code. In my previous role, I built and optimized high-performance data engines, increasing Lucerna Health's ingestion pipeline throughput by over 50% and generating significant savings for our customers' compute-expense. I have also co-authored a publication exploring a novel scheme incorporating curvature information generated using SIMD-parallel forward-mode Automatic Differentiation into unconstrained Quasi-Newton minimization of a smooth objective function. Skilled in AWS, Python, Julia, Spark, DBT, FastAPI/Django, gRPC, Docker, and ML/NLP, I offer cross-disciplinary expertise in mathematics, computer science, finance, and economics. I seek opportunities to leverage my skills and experience to drive organizational growth and innovation, focusing on backend web application roles in data pipelines, ML/AI, and DevOps/Automation engineering. In my free time, I enjoy being inspired by the mountains, skiing, biking, and climbing the granite slopes.",
};

const experiences = [
  {
    company: 'Lucerna Health',
    industry: 'HealthTech',
    title: 'Data Pipeline Engineer',
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
    title: 'Data Scientist',
    startDate: 'November 2021',
    endDate: 'April 2022',
    description: "Responsible for ML feature development and operations and aided three restricted-offshore developers by rapidly resolving blockers, including infrastructure deployments, code reviews, ETL services, and quality assurance testing to accelerate their productivity.",
    projects: [
      "Built analytics pipeline and dashboard to meet data governance auditory requirements for the HiTrust certification of the organization's multi-tenant cloud architecture.",
      "Introduced standard version control safeguards for our data-science department production assets and automated their deployment using AWS CDK and Bitbucket pipelines.",
      "Collaborated on an ML hook into the platform's ingestion pipeline to detect record duplicates during batch ingestion; using the python dedupe library, I built an asynchronous interface around the human-augmented training of the model.",
    ],
  },
  {
    company: 'Michigan Technological University',
    industry: 'Higher Education',
    title: 'Researcher',
    startDate: 'November 2021',
    endDate: 'April 2022',
    description: "Responsibilities included co-authoring and performing the numerical experiment for submission to SIAM’s 2022 conference on Parallel Processing for Scientific Computing of publication: 2022, Azzam J, Henderson D, Ong BW and Struthers AA, Quasi-Newton Optimization with Hessian Samples.",
    projects: [
      "Built BlockOpt.jl, an optim-style interface built on top of ForwardDiff.jl and TRS.jl Julia packages implementing Algorithm 7.1 in publication.",
      "Built UncNLPrograms.jl, a library containing a subset of high-dimensional, nonlinear, and unconstrained optimization problems from the CUTEst set implemented in native Julia to test solvers using Automatic/Algorithmic Differentiation.", 
    ],
  },
  // Add more experiences as needed
];

const githubProfileUrl = 'https://github.com/danphenderson'; // Replace with your GitHub profile URL

const linkedinProfileUrl = 'https://www.linkedin.com/in/daniel-henderson-6a9485bb/'; // Replace with your LinkedIn profile URL

const educationInfo = {
  university: "Michigan Technological University",
  degree: "B.S. Cum Laude, Mathematics, Applied/Computational & Minor in Computer Science",
  date: "Jun 2015 - 2021",
  grades: "Cumulative: 3.56 | Departmental: 3.71",
  activities:
    "President & V.P., Finance Club\n" +
    "Representative, Undergraduate Student Government\n" +
    "Member, Ways and Means Committee, allocating $700K to 200+ student organizations\n" +
    "Liaison, Michigan Tech's Parent Fund Committee, budgeted and voted on the disbursement of $70K\n" +
    "Student Advisor to the Dean of the School of Business and Economics\n" +
    "Junior Partner, Applied Portfolio Management Program",
  achievements:
    "Achievements:\n" +
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
      'Jinja2',
      'LaTeX',
      'MATLAB',
      'Mathematica',
      'HTML',
      'XML',
      'YML',
    ],
  },
  {
    title: 'CLI Tools',
    items: [
      'Amazon CDK & SDK',
      'docker-compose',
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
    items: ['Amazon Redshift', 'PostgreSQL', 'MySQL', 'SQLite'],
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
      'Figma',
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
    <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
      <Grid item component="div" xs={12} sm={12} md={12}
          sx={{
            backgroundImage: `${"./assets/photography/landscape/landscape-tieton-south-fork-1.jpg"}`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}>
      <Grid container spacing={4}  sx={{ padding: 2}}>

        {/* Left Section (Profile Section)*/}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
            <Avatar src={avatar} sx={{ width: 150, height: 150, margin: "0 auto 20px" }} />
            {/* Name and Title */}
            <Typography variant="h5">{aboutMe.name}</Typography>
            <Typography variant="subtitle1">{aboutMe.title}</Typography>           
            <Box>
              <Box sx={{ my: 2 }}>
                <Button variant="contained" color="primary" href={githubProfileUrl} target="_blank">
                  <GitHubIcon />
                  GitHub Profile
                </Button>
              </Box>
              <Box sx={{ my: 2 }}>
                <Button variant="contained" color="primary" href={linkedinProfileUrl} target="_blank">
                  <LinkedInIcon />
                  LinkedIn Profile
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {/* About Me */}
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body1">
                {aboutMe.about}
              </Typography>
            </Box>

            
            {/* Experience */}
            <Box sx={{padding: 2}}>
              <Typography variant="h4" gutterBottom>
                Work Experience
              </Typography>
              {experiences.map((experience, index) => (
                <Box key={index}>
                  <Typography variant="h5">
                    {experience.title} @ {experience.company}
                  </Typography>
                  <Typography variant="subtitle1">
                    {experience.startDate} - {experience.endDate}
                  </Typography>
                  <Typography variant="body1">{experience.description}</Typography>
                </Box>
              ))}
            </Box>
            
            {/* Education */}
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                Education
              </Typography>
              <Typography variant="h5">
                {educationInfo.university}
              </Typography>
              <Typography variant="body1">
                {educationInfo.degree} | {educationInfo.date}
              </Typography>
              <Typography variant="body1">
                
              </Typography>
              <Typography variant="body2">
                {educationInfo.grades}
              </Typography>
              <Typography variant="body2">
                {educationInfo.activities}
              </Typography>
              <Typography variant="body2">
                {educationInfo.achievements}
              </Typography>
            </Box>
            
            {/* Stack and Tools */}
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                Stack and Tools
              </Typography>

              {stackAndTools.map((section) => (
                <Box key={section.title}>
                  <Typography variant="h5" gutterBottom>
                    {section.title}
                  </Typography>
                  <List dense>
                    {section.items.map((item) => (
                      <ListItem key={item}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </Box>
          </Paper>
          </Grid> 
        </Grid>
      </Grid>
    </Grid>
  );
}