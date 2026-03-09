import { Box, Button, Grid, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { ANIMATED_CARD_DURATION_MS } from '../components/AnimatedContentCard';
import { CVMainColumn } from '../components/cv/CVMainColumn';
import { CVSidebar } from '../components/cv/CVSidebar';
import { PageFrame } from '../components/layout/PageFrame';
import {
  aboutMe,
  certificates,
  codingExamples,
  cvBackgroundImage,
  educationInfo,
  experiences,
  linkedinProfileUrl,
  resumeDownloadFilename,
  resumePdfUrl,
  stackAndTools,
  volunteering,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { useAppStyles } from '../styles/appStyles';

export default function CV() {
  const appStyles = useAppStyles();
  const { activity, projects, contributions, loading, error } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const nestedDelayOffsetMs = 160;
  const experienceItemsDelayMs = ANIMATED_CARD_DURATION_MS + nestedDelayOffsetMs;

  const resumeDownloadAction = (
    <Box
      sx={appStyles.resumeDownloadContainerSx}
    >
      <Button
        component="a"
        href={resumePdfUrl}
        download={resumeDownloadFilename}
        variant="outlined"
        size="small"
        aria-label="Download resume as PDF"
        sx={appStyles.resumeDownloadButtonSx}
      >
        Download Resume (PDF)
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
        <Stack spacing={2.5}>
          <CVSidebar
            sections={['about']}
            about={aboutMe}
            linkedinUrl={linkedinProfileUrl}
            resumeDownloadAction={resumeDownloadAction}
            activity={activity}
            contributions={contributions}
            projects={projects}
            loading={loading}
            error={error}
            certificates={certificates}
            stackAndTools={stackAndTools}
          />

          <CVMainColumn
            sections={['experience', 'education', 'volunteering']}
            experiences={experiences}
            education={educationInfo}
            volunteering={volunteering}
            codingExamples={codingExamples}
            experienceItemsDelayMs={experienceItemsDelayMs}
            volunteeringItemsDelayMs={experienceItemsDelayMs}
            spacing={2.5}
          />

          <CVSidebar
            sections={['github']}
            about={aboutMe}
            linkedinUrl={linkedinProfileUrl}
            resumeDownloadAction={resumeDownloadAction}
            activity={activity}
            contributions={contributions}
            projects={projects}
            loading={loading}
            error={error}
            certificates={certificates}
            stackAndTools={stackAndTools}
            githubProjectTitle="Public Projects"
          />

          <CVSidebar
            sections={['certificates', 'tools']}
            about={aboutMe}
            linkedinUrl={linkedinProfileUrl}
            resumeDownloadAction={resumeDownloadAction}
            activity={activity}
            contributions={contributions}
            projects={projects}
            loading={loading}
            error={error}
            certificates={certificates}
            stackAndTools={stackAndTools}
          />

          <CVMainColumn
            sections={['coding']}
            experiences={experiences}
            education={educationInfo}
            volunteering={volunteering}
            codingExamples={codingExamples}
            spacing={2.5}
          />
        </Stack>
      </PageFrame>
    );
  }

  return (
    <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={5} lg={4} sx={{ order: { xs: 2, md: 1 } }}>
          <Box sx={appStyles.cvSidebarPaneSx}>
            <CVSidebar
              sections={['about', 'github', 'certificates', 'tools']}
              about={aboutMe}
              linkedinUrl={linkedinProfileUrl}
              resumeDownloadAction={resumeDownloadAction}
              activity={activity}
              contributions={contributions}
              projects={projects}
              loading={loading}
              error={error}
              certificates={certificates}
              stackAndTools={stackAndTools}
              aboutDelayMs={0}
              githubDelayMs={120}
              certificatesDelayMs={240}
              toolsDelayMs={360}
              githubNestedDelayOffsetMs={120}
              githubProjectTitle="Projects"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={8} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={appStyles.cvMainPaneSx}>
            <CVMainColumn
              sections={['experience', 'education', 'volunteering', 'coding']}
              experiences={experiences}
              education={educationInfo}
              volunteering={volunteering}
              codingExamples={codingExamples}
              experienceDelayMs={0}
              educationDelayMs={120}
              volunteeringDelayMs={240}
              codingDelayMs={360}
              experienceItemsDelayMs={experienceItemsDelayMs}
              volunteeringItemsDelayMs={experienceItemsDelayMs}
              spacing={3.5}
            />
          </Box>
        </Grid>
      </Grid>
    </PageFrame>
  );
}
