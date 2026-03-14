import { Box, Grid, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AppSpeedDial, AppSpeedDialAction } from '../components/AppSpeedDial';
import { CVAboutSection } from '../components/cv/CVAboutSection';
import { CVCertificatesSection } from '../components/cv/CVCertificatesSection';
import { CVCodingSection } from '../components/cv/CVCodingSection';
import { CVEducationSection } from '../components/cv/CVEducationSection';
import { CVExperienceSection } from '../components/cv/CVExperienceSection';
import { CVSectionNavigator } from '../components/cv/CVSectionNavigator';
import { CVSectionStack } from '../components/cv/CVSectionStack';
import { CVVolunteeringSection } from '../components/cv/CVVolunteeringSection';
import { SkillsChipList } from '../components/SkillsChipList';
import {
  cvSectionNavigationOrder,
  CVSectionKey,
  cvSectionMetadata,
} from '../components/cv/cvSectionMetadata';
import { CVGitHubSection } from '../components/cv/CVGitHubSection';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionLeadText, SubsectionTitle } from '../components/text';
import {
  aboutMe,
  certificates,
  codingExamples,
  currentWorkflowLead,
  currentWorkflowTools,
  cvBackgroundImage,
  educationInfo,
  experiences,
  githubSectionLead,
  githubProfileUrl,
  linkedinProfileUrl,
  volunteering,
  resumeDownloadFilename,
  resumePdfUrl,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { CVLayoutMode, CVSectionRegion, cvPageSectionLayout } from './cvPageLayout';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';

type CVResolvedSectionDescriptor = {
  id: string;
  key: CVSectionKey;
  node: ReactNode;
  placement: {
    order: number;
    region: CVSectionRegion;
  };
  delayMs: number;
  triggerOnView: boolean;
};

type CVSectionDefinition = {
  key: CVSectionKey;
  render: (layout: { delayMs: number; triggerOnView: boolean }) => ReactNode;
};

export default function CV() {
  return <CVRouteContent />;
}

const CVRouteContent = () => {
  const appStyles = useAppStyles();
  const { motionTokens } = useComponentStyles();
  const { activity, contributions, loading, error } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const layoutMode: CVLayoutMode = isMobile ? 'mobile' : 'desktop';
  const githubNestedDelayOffsetMs = motionTokens.sectionStaggerMs / 2;
  const itemOffsetMs = motionTokens.itemOffsetMs;

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

  const aboutSpeedDial = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AppSpeedDial
        ariaLabel="Open about actions"
        icon={<MoreHorizIcon />}
        actions={aboutActions}
        layer="content"
        FabProps={{ size: 'small' }}
        direction="left"
        actionTooltipPlacement="top"
        sx={{ position: 'static' }}
      />
    </Box>
  );

  const aboutFooter = (
    <Stack spacing={1}>
      <SubsectionTitle>Current workflow</SubsectionTitle>
      <SectionLeadText>{currentWorkflowLead}</SectionLeadText>
      <SkillsChipList skills={currentWorkflowTools} dense />
    </Stack>
  );

  const sectionDefinitions: CVSectionDefinition[] = [
    {
      key: 'about',
      render: (layout) => (
        <CVAboutSection
          about={aboutMe}
          actions={aboutSpeedDial}
          footer={aboutFooter}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          sectionId={cvSectionMetadata.about.id}
        />
      ),
    },
    {
      key: 'experience',
      render: (layout) => (
        <CVExperienceSection
          experiences={experiences}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.experience.id}
        />
      ),
    },
    {
      key: 'education',
      render: (layout) => (
        <CVEducationSection
          education={educationInfo}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.education.id}
        />
      ),
    },
    {
      key: 'volunteering',
      render: (layout) => (
        <CVVolunteeringSection
          volunteering={volunteering}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.volunteering.id}
        />
      ),
    },
    {
      key: 'github',
      render: (layout) => (
        <CVGitHubSection
          activity={activity}
          contributions={contributions}
          loading={loading}
          error={error}
          sectionDelayMs={layout.delayMs}
          nestedDelayOffsetMs={githubNestedDelayOffsetMs}
          itemOffsetMs={itemOffsetMs}
          lead={githubSectionLead}
          sectionId={cvSectionMetadata.github.id}
        />
      ),
    },
    {
      key: 'certificates',
      render: (layout) => (
        <CVCertificatesSection
          certificates={certificates}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.certificates.id}
        />
      ),
    },
    {
      key: 'coding',
      render: (layout) => (
        <CVCodingSection
          examples={codingExamples}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.coding.id}
        />
      ),
    },
  ];

  const sectionDescriptors: CVResolvedSectionDescriptor[] = sectionDefinitions.map(
    ({ key, render }) => {
      const layout = cvPageSectionLayout[key][layoutMode];

      return {
        id: cvSectionMetadata[key].id,
        key,
        node: render(layout),
        placement: {
          order: layout.order,
          region: layout.region,
        },
        delayMs: layout.delayMs,
        triggerOnView: layout.triggerOnView,
      };
    }
  );

  const renderSectionDescriptor = (descriptor: CVResolvedSectionDescriptor) => (
    <Box
      key={descriptor.key}
      data-testid={`cv-section-region-item-${descriptor.placement.region}-${descriptor.key}`}
      data-section-delay-ms={descriptor.delayMs}
      data-section-trigger-on-view={String(descriptor.triggerOnView)}
    >
      {descriptor.node}
    </Box>
  );

  const getSectionNodesForRegion = (region: CVSectionRegion) =>
    sectionDescriptors
      .filter((descriptor) => descriptor.placement.region === region)
      .sort((left, right) => left.placement.order - right.placement.order)
      .map(renderSectionDescriptor);

  if (isMobile) {
    const mobileSections = sectionDescriptors
      .filter((descriptor) => descriptor.placement.region === 'stack')
      .sort((left, right) => left.placement.order - right.placement.order);
    const mobileAboutSection = mobileSections.find((descriptor) => descriptor.key === 'about');
    const mobileBodySections = mobileSections.filter((descriptor) => descriptor.key !== 'about');

    return (
      <PageFrame
        image={cvBackgroundImage}
        maxWidth={1600}
        containerSx={appStyles.cvPageContainerSx}
      >
        <>
          <CVSectionStack spacing={2.5}>
            {mobileAboutSection && renderSectionDescriptor(mobileAboutSection)}
            {mobileBodySections.map(renderSectionDescriptor)}
          </CVSectionStack>
          <CVSectionNavigator sections={cvSectionNavigationOrder} testId="cv-section-navigator" />
        </>
      </PageFrame>
    );
  }

  return (
    <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
      <>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12}>
            <Box sx={appStyles.cvPagePaneSx} data-testid="cv-desktop-top-region">
              <CVSectionStack spacing={2.5}>{getSectionNodesForRegion('top')}</CVSectionStack>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} lg={4} sx={appStyles.cvDesktopAsideGridItemSx}>
            <Box sx={appStyles.cvPagePaneSx} data-testid="cv-desktop-sidebar-region">
              <CVSectionStack spacing={2.5}>{getSectionNodesForRegion('sidebar')}</CVSectionStack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7} lg={8} sx={appStyles.cvDesktopMainGridItemSx}>
            <Box sx={appStyles.cvPagePrimaryPaneSx} data-testid="cv-desktop-main-region">
              <CVSectionStack spacing={3.5}>{getSectionNodesForRegion('main')}</CVSectionStack>
            </Box>
          </Grid>
        </Grid>
        <CVSectionNavigator sections={cvSectionNavigationOrder} testId="cv-section-navigator" />
      </>
    </PageFrame>
  );
};
