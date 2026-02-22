import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import BackgroundPaper from '../components/BackgroundPaper';
import { CodingExamplesSection } from '../components/cv/CodingExamplesSection';
import { CertificatesList } from '../components/cv/CertificatesList';
import { EducationSection } from '../components/cv/EducationSection';
import { ExperienceList } from '../components/cv/ExperienceList';
import { GitHubActivityList } from '../components/cv/GitHubActivityList';
import { GitHubContributionCalendar } from '../components/cv/GitHubContributionCalendar';
import { GitHubContributions } from '../components/cv/GitHubContributions';
import { GitHubProjects } from '../components/cv/GitHubProjects';
import { ProfileCard } from '../components/cv/ProfileCard';
import { SectionHeading } from '../components/cv/SectionHeading';
import { ToolsAccordion } from '../components/ToolsAccordion';
import { useCvStyles } from '../ThemeProvider';
import {
  AnimatedContentCard,
  ANIMATED_CARD_DURATION_MS,
} from '../components/AnimatedContentCard';
import {
  aboutMe,
  certificates,
  codingExamples,
  cvBackgroundImage,
  educationInfo,
  experiences,
  githubUsername,
  linkedinProfileUrl,
  stackAndTools,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';

export default function CV() {
  const { activity, projects, contributions, loading, error } = useGithubProfile();
  const muiTheme = useMuiTheme();
  const { subtleBorder, subtleSurface } = useCvStyles();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const nestedDelayOffsetMs = 160;
  const experienceItemsDelay = ANIMATED_CARD_DURATION_MS + nestedDelayOffsetMs;
  const ghostCardSx = {
    p: 0,
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
  };
  const githubSectionTitleSx = {
    color: 'text.primary',
    fontWeight: 700,
  };
  const githubSectionDividerSx = {
    borderColor: 'divider',
  };
  const githubOverlineSx = {
    mb: 0.5,
    ml: { xs: 1.5, md: 1.5 },
    mt: { xs: 0.75, md: 0.75 },
  };
  const githubSectionPanelSx = {
    borderRadius: 1.5,
    border: subtleBorder,
    backgroundColor: subtleSurface,
    p: { xs: 1, md: 1.00 },
  };
  const githubStaggerMs = 200;
  const githubNestedBaseDelayMs = ANIMATED_CARD_DURATION_MS + nestedDelayOffsetMs;
  const githubItemDelayOffsetMs = ANIMATED_CARD_DURATION_MS + nestedDelayOffsetMs;

  if (isMobile) {
    const githubActivityDelayMs = githubNestedBaseDelayMs;
    const githubActivityItemsDelayMs = githubActivityDelayMs + githubItemDelayOffsetMs;
    const githubContributionsDelayMs = githubNestedBaseDelayMs + githubStaggerMs;
    const githubContributionsItemsDelayMs = githubContributionsDelayMs + githubItemDelayOffsetMs;

    return (
      <BackgroundPaper image={cvBackgroundImage} showShell={false}>
        <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1.5, md: 5 }, py: { xs: 2, md: 4 } }}>
          <Stack spacing={2.5}>
            <AnimatedContentCard delayMs={0}>
              <Stack spacing={2}>
                <SectionHeading overline="About" sx={{ mb: 0.5 }} />
                <ProfileCard about={aboutMe} linkedinUrl={linkedinProfileUrl} />
              </Stack>
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <SectionHeading overline="Experience" title="Roles & Impact" />
              <ExperienceList experiences={experiences} startDelayMs={experienceItemsDelay} />
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <SectionHeading overline="Education" />
              <EducationSection education={educationInfo} />
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <Stack spacing={2}>
                <SectionHeading overline="GitHub" sx={githubOverlineSx} />
                <AnimatedContentCard delayMs={githubActivityDelayMs} sx={ghostCardSx}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                      Recent Activity
                    </Typography>
                    <Box sx={githubSectionPanelSx}>
                      <GitHubActivityList
                        activity={activity}
                        loading={loading}
                        error={error}
                        startDelayMs={githubActivityItemsDelayMs}
                      />
                    </Box>
                  </Stack>
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={githubContributionsDelayMs} sx={ghostCardSx}>
                  <Stack spacing={1}>
                    <Divider sx={githubSectionDividerSx} />
                    <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                      Contributions
                    </Typography>
                    <Box sx={githubSectionPanelSx}>
                      <GitHubContributions
                        contributions={contributions}
                        loading={loading}
                        variant="list"
                        startDelayMs={githubContributionsItemsDelayMs}
                      />
                    </Box>
                  </Stack>
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={githubNestedBaseDelayMs + githubStaggerMs * 2} sx={ghostCardSx}>
                  <Stack spacing={1}>
                    <Divider sx={githubSectionDividerSx} />
                    <GitHubContributionCalendar username={githubUsername} contained={false} />
                  </Stack>
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={githubNestedBaseDelayMs + githubStaggerMs * 3} sx={ghostCardSx}>
                  <Stack spacing={1}>
                    <Divider sx={githubSectionDividerSx} />
                    <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                      Public Projects
                    </Typography>
                    <Box sx={githubSectionPanelSx}>
                      <GitHubProjects projects={projects} />
                    </Box>
                  </Stack>
                </AnimatedContentCard>
              </Stack>
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <SectionHeading overline="Certificates" title="Credentials" />
              <CertificatesList certificates={certificates} />
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <Stack spacing={2}>
                <SectionHeading overline="Stack & Tools" sx={{ mb: 0.5 }} />
                {stackAndTools.map((section) => (
                  <ToolsAccordion
                    key={section.title}
                    title={section.title}
                    subtitle=""
                    tools={section.items}
                    dense
                    defaultExpanded={false}
                  />
                ))}
              </Stack>
            </AnimatedContentCard>

            <AnimatedContentCard delayMs={0}>
              <SectionHeading overline="Coding Examples" title="Selected Work" />
              <CodingExamplesSection examples={codingExamples} />
            </AnimatedContentCard>
          </Stack>
        </Box>
      </BackgroundPaper>
    );
  }

  return (
    <BackgroundPaper image={cvBackgroundImage} showShell={false}>
      <Box sx={{ maxWidth: 1600, mx: 'auto', px: { xs: 1.5, md: 5 }, py: { xs: 2, md: 4 } }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={5} lg={4} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              sx={{
                height: '100%',
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Stack spacing={2.5}>
                <AnimatedContentCard delayMs={0}>
                  <Stack spacing={2}>
                    <SectionHeading overline="About" sx={{ mb: 0.5 }} />
                    <ProfileCard about={aboutMe} linkedinUrl={linkedinProfileUrl} />
                  </Stack>
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={120}>
                  <Stack spacing={2}>
                    <SectionHeading overline="GitHub" sx={githubOverlineSx} />

                    <AnimatedContentCard delayMs={githubNestedBaseDelayMs + 120} sx={ghostCardSx}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                          Recent Activity
                        </Typography>
                        <Box sx={githubSectionPanelSx}>
                          <GitHubActivityList
                            activity={activity}
                            loading={loading}
                            error={error}
                            startDelayMs={githubNestedBaseDelayMs + 120 + githubItemDelayOffsetMs}
                          />
                        </Box>
                      </Stack>
                    </AnimatedContentCard>

                    <AnimatedContentCard delayMs={githubNestedBaseDelayMs + 120 + githubStaggerMs} sx={ghostCardSx}>
                      <Stack spacing={1}>
                        <Divider sx={githubSectionDividerSx} />
                        <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                          Contributions
                        </Typography>
                        <Box sx={githubSectionPanelSx}>
                          <GitHubContributions
                            contributions={contributions}
                            loading={loading}
                            variant="list"
                            startDelayMs={githubNestedBaseDelayMs + 120 + githubStaggerMs + githubItemDelayOffsetMs}
                          />
                        </Box>
                      </Stack>
                    </AnimatedContentCard>

                    <AnimatedContentCard delayMs={githubNestedBaseDelayMs + 120 + githubStaggerMs * 2} sx={ghostCardSx}>
                      <Stack spacing={1}>
                        <Divider sx={githubSectionDividerSx} />
                        <GitHubContributionCalendar username={githubUsername} contained={false} />
                      </Stack>
                    </AnimatedContentCard>

                    <AnimatedContentCard delayMs={githubNestedBaseDelayMs + 120 + githubStaggerMs * 3} sx={ghostCardSx}>
                      <Stack spacing={1}>
                        <Divider sx={githubSectionDividerSx} />
                        <Typography variant="subtitle2" sx={githubSectionTitleSx}>
                          Projects
                        </Typography>
                        <Box sx={githubSectionPanelSx}>
                          <GitHubProjects projects={projects} />
                        </Box>
                      </Stack>
                    </AnimatedContentCard>
                  </Stack>
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={240}>
                  <SectionHeading overline="Certificates" title="Credentials" />
                  <CertificatesList certificates={certificates} />
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={360}>
                  <Stack spacing={2}>
                    <SectionHeading overline="Stack & Tools" sx={{ mb: 0.5 }} />
                    {stackAndTools.map((section) => (
                      <ToolsAccordion
                        key={section.title}
                        title={section.title}
                        subtitle=""
                        tools={section.items}
                        dense
                        defaultExpanded={false}
                      />
                    ))}
                  </Stack>
                </AnimatedContentCard>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={7} lg={8} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                p: { xs: 2.5, md: 3.5 },
              }}
            >
              <Stack spacing={3.5}>
                <AnimatedContentCard delayMs={0}>
                  <SectionHeading overline="Experience" title="Roles & Impact" />
                  <ExperienceList experiences={experiences} startDelayMs={experienceItemsDelay} />
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={120}>
                  <SectionHeading overline="Education" />
                  <EducationSection education={educationInfo} />
                </AnimatedContentCard>

                <AnimatedContentCard delayMs={240}>
                  <SectionHeading overline="Coding Examples" title="Selected Work" />
                  <CodingExamplesSection examples={codingExamples} />
                </AnimatedContentCard>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPaper>
  );
}
