import { Box, Grid } from '@mui/material';
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
import { CVStackToolsSection } from '../components/cv/CVStackToolsSection';
import { CVVolunteeringSection } from '../components/cv/CVVolunteeringSection';
import {
  cvSectionNavigationOrder,
  CVSectionKey,
  cvSectionMetadata,
} from '../components/cv/cvSectionMetadata';
import { CVGitHubSection } from '../components/cv/CVGitHubSection';
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
import {
  CVLayoutMode,
  CVSectionRegion,
  cvPageSectionLayout,
} from './cvPageLayout';
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

export default function CV() {
  const appStyles = useAppStyles();
  const { motionTokens } = useComponentStyles();
  const { activity, projects, contributions, loading, error } = useGithubProfile();
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
        direction="left"
        actionTooltipPlacement="top"
      />
    </Box>
  );

  const sectionNavigator = <CVSectionNavigator sections={cvSectionNavigationOrder} testId="cv-section-navigator" />;
  const sectionDescriptors: Record<CVSectionKey, CVResolvedSectionDescriptor> = {
    about: {
      id: cvSectionMetadata.about.id,
      key: 'about',
      node: (
        <CVAboutSection
          about={aboutMe}
          actions={aboutSpeedDial}
          footer={sectionNavigator}
          delayMs={cvPageSectionLayout.about[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.about[layoutMode].triggerOnView}
          sectionId={cvSectionMetadata.about.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.about[layoutMode].order,
        region: cvPageSectionLayout.about[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.about[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.about[layoutMode].triggerOnView,
    },
    experience: {
      id: cvSectionMetadata.experience.id,
      key: 'experience',
      node: (
        <CVExperienceSection
          experiences={experiences}
          delayMs={cvPageSectionLayout.experience[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.experience[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.experience.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.experience[layoutMode].order,
        region: cvPageSectionLayout.experience[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.experience[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.experience[layoutMode].triggerOnView,
    },
    education: {
      id: cvSectionMetadata.education.id,
      key: 'education',
      node: (
        <CVEducationSection
          education={educationInfo}
          delayMs={cvPageSectionLayout.education[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.education[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.education.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.education[layoutMode].order,
        region: cvPageSectionLayout.education[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.education[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.education[layoutMode].triggerOnView,
    },
    volunteering: {
      id: cvSectionMetadata.volunteering.id,
      key: 'volunteering',
      node: (
        <CVVolunteeringSection
          volunteering={volunteering}
          delayMs={cvPageSectionLayout.volunteering[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.volunteering[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.volunteering.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.volunteering[layoutMode].order,
        region: cvPageSectionLayout.volunteering[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.volunteering[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.volunteering[layoutMode].triggerOnView,
    },
    github: {
      id: cvSectionMetadata.github.id,
      key: 'github',
      node: (
        <CVGitHubSection
          activity={activity}
          contributions={contributions}
          projects={projects}
          loading={loading}
          error={error}
          sectionDelayMs={cvPageSectionLayout.github[layoutMode].delayMs}
          nestedDelayOffsetMs={githubNestedDelayOffsetMs}
          itemOffsetMs={itemOffsetMs}
          projectTitle={isMobile ? 'Public Projects' : 'Projects'}
          sectionId={cvSectionMetadata.github.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.github[layoutMode].order,
        region: cvPageSectionLayout.github[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.github[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.github[layoutMode].triggerOnView,
    },
    certificates: {
      id: cvSectionMetadata.certificates.id,
      key: 'certificates',
      node: (
        <CVCertificatesSection
          certificates={certificates}
          delayMs={cvPageSectionLayout.certificates[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.certificates[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.certificates.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.certificates[layoutMode].order,
        region: cvPageSectionLayout.certificates[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.certificates[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.certificates[layoutMode].triggerOnView,
    },
    tools: {
      id: cvSectionMetadata.tools.id,
      key: 'tools',
      node: (
        <CVStackToolsSection
          sections={stackAndTools}
          delayMs={cvPageSectionLayout.tools[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.tools[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.tools.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.tools[layoutMode].order,
        region: cvPageSectionLayout.tools[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.tools[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.tools[layoutMode].triggerOnView,
    },
    coding: {
      id: cvSectionMetadata.coding.id,
      key: 'coding',
      node: (
        <CVCodingSection
          examples={codingExamples}
          delayMs={cvPageSectionLayout.coding[layoutMode].delayMs}
          triggerOnView={cvPageSectionLayout.coding[layoutMode].triggerOnView}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.coding.id}
        />
      ),
      placement: {
        order: cvPageSectionLayout.coding[layoutMode].order,
        region: cvPageSectionLayout.coding[layoutMode].region,
      },
      delayMs: cvPageSectionLayout.coding[layoutMode].delayMs,
      triggerOnView: cvPageSectionLayout.coding[layoutMode].triggerOnView,
    },
  };

  const getSectionNodesForRegion = (region: CVSectionRegion) =>
    (Object.values(sectionDescriptors) as CVResolvedSectionDescriptor[])
      .filter((descriptor) => descriptor.placement.region === region)
      .sort((left, right) => left.placement.order - right.placement.order)
      .map((descriptor) => (
        <Box
          key={descriptor.key}
          data-testid={`cv-section-region-item-${region}-${descriptor.key}`}
          data-section-delay-ms={descriptor.delayMs}
          data-section-trigger-on-view={String(descriptor.triggerOnView)}
        >
          {descriptor.node}
        </Box>
      ));

  if (isMobile) {
    return (
      <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
        <CVSectionStack spacing={2.5}>
          {getSectionNodesForRegion('stack')}
        </CVSectionStack>
      </PageFrame>
    );
  }

  return (
    <PageFrame image={cvBackgroundImage} maxWidth={1600} containerSx={appStyles.cvPageContainerSx}>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <Box sx={appStyles.cvPagePaneSx} data-testid="cv-desktop-top-region">
            <CVSectionStack spacing={2.5}>
              {getSectionNodesForRegion('top')}
            </CVSectionStack>
          </Box>
        </Grid>

        <Grid item xs={12} md={5} lg={4} sx={appStyles.cvDesktopAsideGridItemSx}>
          <Box sx={appStyles.cvPagePaneSx} data-testid="cv-desktop-sidebar-region">
            <CVSectionStack spacing={2.5}>
              {getSectionNodesForRegion('sidebar')}
            </CVSectionStack>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={8} sx={appStyles.cvDesktopMainGridItemSx}>
          <Box sx={appStyles.cvPagePrimaryPaneSx} data-testid="cv-desktop-main-region">
            <CVSectionStack spacing={3.5}>
              {getSectionNodesForRegion('main')}
            </CVSectionStack>
          </Box>
        </Grid>
      </Grid>
    </PageFrame>
  );
}
