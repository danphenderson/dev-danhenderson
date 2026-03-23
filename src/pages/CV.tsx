import { Box, Grid } from '@mui/material';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AppSpeedDial, AppSpeedDialAction } from '../components/AppSpeedDial';
import { CVSectionNavigator } from '../components/cv/CVSectionNavigator';
import { CVSectionStack } from '../components/cv/CVSectionStack';
import { CVStoryHeader } from '../components/cv/CVStoryHeader';
import { CVStoryViewer } from '../components/cv/CVStoryViewer';
import { CVGitHubStatusTooltip } from '../components/cv/CVGitHubStatusTooltip';
import { cvSectionNavigationOrder } from '../components/cv/cvSectionMetadata';
import { PageFrame } from '../components/layout/PageFrame';
import {
  aboutMe,
  certificates,
  codingExamples,
  currentWorkflowTools,
  cvBackgroundImage,
  cvStoryEndData,
  educationInfo,
  experiences,
  githubProfileUrl,
  linkedinProfileUrl,
  volunteering,
  resumeDownloadFilename,
  resumePdfUrl,
} from '../data/cv';
import { buildCVStoryItems } from '../data/cvStoryItems';
import { siteRouteMap, cvStoryModeMetadata } from '../constants/siteRoutes';
import type { CVMode } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { CVLayoutMode } from './cvPageLayout';
import {
  buildCVSectionDescriptors,
  getSectionDescriptorsForRegion,
  useCVRevealState,
  type CVResolvedSectionDescriptor,
} from './cvRouteOrchestration';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';

const parseCVMode = (value: string | null): CVMode => (value === 'story' ? 'story' : 'default');

export default function CV() {
  return <CVRouteContent />;
}

const CVRouteContent = () => {
  const appStyles = useAppStyles();
  const { motionTokens } = useComponentStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const cvMode = parseCVMode(searchParams.get('mode'));
  const isStoryMode = cvMode === 'story';

  const documentMetadata = isStoryMode
    ? {
        title: cvStoryModeMetadata.title,
        description: cvStoryModeMetadata.description,
        image: siteRouteMap.cv.image,
        canonicalPath: siteRouteMap.cv.path,
      }
    : { ...siteRouteMap.cv, canonicalPath: siteRouteMap.cv.path };
  useDocumentMetadata(documentMetadata);

  const { activity, contributions, loading, error, status } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const layoutMode: CVLayoutMode = isMobile ? 'mobile' : 'desktop';
  const revealState = useCVRevealState({
    bio: aboutMe.bio,
    opportunities: aboutMe.opportunities ?? [],
    workflowTools: currentWorkflowTools,
  });

  const handleToggleMode = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (parseCVMode(prev.get('mode')) === 'story') {
          next.delete('mode');
        } else {
          next.set('mode', 'story');
        }
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

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
  const aboutModeControls = (
    <CVStoryHeader mode={cvMode} onToggleMode={handleToggleMode} variant="embedded" />
  );
  const githubStatusTooltip = <CVGitHubStatusTooltip status={status} />;

  const sectionDescriptors: CVResolvedSectionDescriptor[] = buildCVSectionDescriptors({
    layoutMode,
    about: aboutMe,
    aboutActions: aboutSpeedDial,
    aboutFooterControls: aboutModeControls,
    currentWorkflowTools,
    experiences,
    education: educationInfo,
    volunteering,
    certificates,
    codingExamples,
    githubActivity: activity,
    githubContributions: contributions,
    githubLoading: loading,
    githubError: error,
    githubStatusTooltip,
    motionTokens,
    revealState,
  });

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

  const getSectionNodesForRegion = (region: 'top' | 'sidebar' | 'main') =>
    getSectionDescriptorsForRegion(sectionDescriptors, region).map(renderSectionDescriptor);

  // ── Story mode ─────────────────────────────────────────────────────

  if (isStoryMode) {
    return (
      <CVStoryViewer
        items={buildCVStoryItems({
          about: aboutMe,
          experiences,
          education: educationInfo,
          certificates,
          volunteering,
          codingExamples,
          endData: cvStoryEndData,
        })}
        onExit={handleToggleMode}
      />
    );
  }

  // ── Default exploratory mode ───────────────────────────────────────

  if (isMobile) {
    const mobileSections = getSectionDescriptorsForRegion(sectionDescriptors, 'stack');
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
