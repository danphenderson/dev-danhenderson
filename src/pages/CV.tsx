import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
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
import { ContentCard } from '../components/ContentCard';
import {
  aboutMe,
  certificates,
  codingExamples,
  cvBackgroundImage,
  educationInfo,
  experiences,
  githubUsername,
  linkedinProfileUrl,
  commonTools,
  stackAndTools,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';

export default function CV() {
  const { activity, projects, contributions, loading, error } = useGithubProfile();

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
                <ContentCard>
                  <Stack spacing={2}>
                    <SectionHeading overline="About" sx={{ mb: 0.5 }} />
                    <ProfileCard about={aboutMe} linkedinUrl={linkedinProfileUrl} />
                  </Stack>
                </ContentCard>

                <ContentCard>
                  <Stack spacing={2}>
                    <SectionHeading overline="GitHub" sx={{ mb: 0.5 }} />

                    <Typography variant="h4" sx={{ color: 'text.primary' }}>
                      Recent Activity
                    </Typography>
                    <GitHubActivityList activity={activity} loading={loading} error={error} />

                    <Divider sx={{ borderColor: 'divider' }} />

                    <Typography variant="h4" sx={{ color: 'text.primary' }}>
                      Open Source Contributions
                    </Typography>
                    <GitHubContributions contributions={contributions} loading={loading} variant="list" />

                    <Divider sx={{ borderColor: 'divider' }} />
                    <GitHubContributionCalendar username={githubUsername} contained={false} />

                    <Divider sx={{ borderColor: 'divider' }} />

                    <Typography variant="h4" sx={{ color: 'text.primary' }}>
                      Open Source Projects
                    </Typography>
                    <GitHubProjects projects={projects} />
                  </Stack>
                </ContentCard>

                <ContentCard>
                  <SectionHeading overline="Certificates" title="Credentials" />
                  <CertificatesList certificates={certificates} />
                </ContentCard>

                <ContentCard>
                  <Stack spacing={2}>
                    <SectionHeading overline="Stack & Tools" sx={{ mb: 0.5 }} />
                    <ToolsAccordion
                      title="Common tools & platforms"
                      subtitle="Core utilities used across engagements."
                      tools={commonTools}
                      dense
                      defaultExpanded={false}
                    />

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
                </ContentCard>
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
                <ContentCard>
                  <SectionHeading overline="Experience" title="Roles & Impact" />
                  <ExperienceList experiences={experiences} />
                </ContentCard>

                <ContentCard>
                  <SectionHeading overline="Education" />
                  <EducationSection education={educationInfo} />
                </ContentCard>

                <ContentCard>
                  <SectionHeading overline="Coding Examples" title="Selected Work" />
                  <CodingExamplesSection examples={codingExamples} />
                </ContentCard>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPaper>
  );
}
