import { Box, Button, Grid, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
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
import { useCvStyles } from '../styles/cvStyles';

export default function CV() {
  const appStyles = useAppStyles();
  const { getSectionDelayMs, motionTokens } = useCvStyles();
  const { activity, projects, contributions, loading, error } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const githubNestedDelayOffsetMs = motionTokens.sectionStaggerMs / 2;
  const itemOffsetMs = motionTokens.itemOffsetMs;

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
            itemOffsetMs={itemOffsetMs}
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
            itemOffsetMs={itemOffsetMs}
            githubNestedDelayOffsetMs={githubNestedDelayOffsetMs}
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
            itemOffsetMs={itemOffsetMs}
          />

          <CVMainColumn
            sections={['coding']}
            experiences={experiences}
            education={educationInfo}
            volunteering={volunteering}
            codingExamples={codingExamples}
            itemOffsetMs={itemOffsetMs}
            spacing={2.5}
          />
        </Stack>
      </PageFrame>
    );
  }

  return (
    <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={5} lg={4} sx={appStyles.cvSidebarGridItemSx}>
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
              aboutDelayMs={getSectionDelayMs(0)}
              githubDelayMs={getSectionDelayMs(1)}
              certificatesDelayMs={getSectionDelayMs(2)}
              toolsDelayMs={getSectionDelayMs(3)}
              itemOffsetMs={itemOffsetMs}
              githubNestedDelayOffsetMs={githubNestedDelayOffsetMs}
              githubProjectTitle="Projects"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={8} sx={appStyles.cvMainGridItemSx}>
          <Box sx={appStyles.cvMainPaneSx}>
            <CVMainColumn
              sections={['experience', 'education', 'volunteering', 'coding']}
              experiences={experiences}
              education={educationInfo}
              volunteering={volunteering}
              codingExamples={codingExamples}
              experienceDelayMs={getSectionDelayMs(0)}
              educationDelayMs={getSectionDelayMs(1)}
              volunteeringDelayMs={getSectionDelayMs(2)}
              codingDelayMs={getSectionDelayMs(3)}
              itemOffsetMs={itemOffsetMs}
              spacing={3.5}
            />
          </Box>
        </Grid>
      </Grid>
    </PageFrame>
  );
}
