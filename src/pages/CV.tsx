import { ReactNode } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { AppSpeedDial, AppSpeedDialAction } from '../components/AppSpeedDial';
import { CVMainColumn } from '../components/cv/CVMainColumn';
import { CVSidebar } from '../components/cv/CVSidebar';
import {
  CVSectionKey,
  cvProductivitySectionOrder,
  cvSectionMetadata,
} from '../components/cv/cvSectionMetadata';
import { PageFrame } from '../components/layout/PageFrame';
import {
  aboutMe,
  certificates,
  codingExamples,
  cvBackgroundImage,
  educationInfo,
  experiences,
  githubProfileUrl,
  linkedinProfileUrl,
  stackAndTools,
  volunteering,
  resumeDownloadFilename,
  resumePdfUrl,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { useAppStyles } from '../styles/appStyles';
import { useCvStyles } from '../styles/cvStyles';

const cvProductivityIcons: Record<CVSectionKey, ReactNode> = {
  about: <InfoOutlinedIcon fontSize="small" />,
  experience: <WorkOutlineIcon fontSize="small" />,
  education: <SchoolOutlinedIcon fontSize="small" />,
  volunteering: <VolunteerActivismOutlinedIcon fontSize="small" />,
  github: <GitHubIcon fontSize="small" />,
  certificates: <WorkspacePremiumOutlinedIcon fontSize="small" />,
  tools: <BuildOutlinedIcon fontSize="small" />,
  coding: <CodeOutlinedIcon fontSize="small" />,
};

export default function CV() {
  const appStyles = useAppStyles();
  const { getSectionDelayMs, motionTokens } = useCvStyles();
  const { activity, projects, contributions, loading, error } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const githubNestedDelayOffsetMs = motionTokens.sectionStaggerMs / 2;
  const itemOffsetMs = motionTokens.itemOffsetMs;
  const sidebarSectionIds = {
    about: cvSectionMetadata.about.id,
    github: cvSectionMetadata.github.id,
    certificates: cvSectionMetadata.certificates.id,
    tools: cvSectionMetadata.tools.id,
  } as const;
  const mainSectionIds = {
    experience: cvSectionMetadata.experience.id,
    education: cvSectionMetadata.education.id,
    volunteering: cvSectionMetadata.volunteering.id,
    coding: cvSectionMetadata.coding.id,
  } as const;

  const handleJumpToSection = (sectionKey: CVSectionKey) => () => {
    document.getElementById(cvSectionMetadata[sectionKey].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const aboutActions: AppSpeedDialAction[] = [
    {
      id: 'github-profile',
      label: 'GitHub',
      icon: <GitHubIcon fontSize="small" />,
      href: githubProfileUrl,
      external: true,
    },
    {
      id: 'linkedin-profile',
      label: 'LinkedIn',
      icon: <LinkedInIcon fontSize="small" />,
      href: linkedinProfileUrl,
      external: true,
    },
    {
      id: 'email',
      label: 'Email',
      icon: <EmailOutlinedIcon fontSize="small" />,
      href: `mailto:${aboutMe.email}`,
    },
    {
      id: 'download-resume',
      label: 'Download Resume',
      icon: <DownloadIcon fontSize="small" />,
      href: resumePdfUrl,
      download: resumeDownloadFilename,
    },
  ];

  const productivityActions: AppSpeedDialAction[] = cvProductivitySectionOrder.map((sectionKey) => ({
    id: `jump-${sectionKey}`,
    label: cvSectionMetadata[sectionKey].label,
    icon: cvProductivityIcons[sectionKey],
    onClick: handleJumpToSection(sectionKey),
  }));

  const aboutSpeedDial = (
    <Box sx={[appStyles.resumeDownloadContainerSx, { mb: 0 }]}>
      <AppSpeedDial
        ariaLabel="Open about actions"
        icon={<MoreHorizIcon />}
        actions={aboutActions}
        direction="left"
        actionTooltipPlacement="top"
      />
    </Box>
  );

  const productivitySpeedDial = (
    <AppSpeedDial
      ariaLabel="Open CV section navigation"
      icon={<UnfoldMoreIcon />}
      actions={productivityActions}
      actionLabelsAlwaysOpen
      sx={{
        position: 'fixed',
        right: { xs: 16, md: 28 },
        bottom: { xs: 16, md: 28 },
      }}
    />
  );

  if (isMobile) {
    return (
      <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
        <Stack spacing={2.5}>
          <CVSidebar
            sections={['about']}
            about={aboutMe}
            aboutActions={aboutSpeedDial}
            activity={activity}
            contributions={contributions}
            projects={projects}
            loading={loading}
            error={error}
            certificates={certificates}
            stackAndTools={stackAndTools}
            sectionIds={{ about: sidebarSectionIds.about }}
          />

          <CVMainColumn
            sections={['experience', 'education', 'volunteering']}
            experiences={experiences}
            education={educationInfo}
            volunteering={volunteering}
            codingExamples={codingExamples}
            itemOffsetMs={itemOffsetMs}
            spacing={2.5}
            sectionIds={{
              experience: mainSectionIds.experience,
              education: mainSectionIds.education,
              volunteering: mainSectionIds.volunteering,
            }}
          />

          <CVSidebar
            sections={['github']}
            about={aboutMe}
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
            sectionIds={{ github: sidebarSectionIds.github }}
          />

          <CVSidebar
            sections={['certificates', 'tools']}
            about={aboutMe}
            activity={activity}
            contributions={contributions}
            projects={projects}
            loading={loading}
            error={error}
            certificates={certificates}
            stackAndTools={stackAndTools}
            itemOffsetMs={itemOffsetMs}
            sectionIds={{
              certificates: sidebarSectionIds.certificates,
              tools: sidebarSectionIds.tools,
            }}
          />

          <CVMainColumn
            sections={['coding']}
            experiences={experiences}
            education={educationInfo}
            volunteering={volunteering}
            codingExamples={codingExamples}
            itemOffsetMs={itemOffsetMs}
            spacing={2.5}
            sectionIds={{ coding: mainSectionIds.coding }}
          />
        </Stack>
        {productivitySpeedDial}
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
              aboutActions={aboutSpeedDial}
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
              sectionIds={sidebarSectionIds}
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
              sectionIds={mainSectionIds}
            />
          </Box>
        </Grid>
      </Grid>
      {productivitySpeedDial}
    </PageFrame>
  );
}
