import { Box, Divider, Grid, Paper, Stack } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
import { CodingExamplesSection } from '../components/cv/CodingExamplesSection';
import { CertificatesList } from '../components/cv/CertificatesList';
import { ContactButtons } from '../components/cv/ContactButtons';
import { EducationSection } from '../components/cv/EducationSection';
import { ExperienceList } from '../components/cv/ExperienceList';
import { GitHubActivityList } from '../components/cv/GitHubActivityList';
import { GitHubContributions } from '../components/cv/GitHubContributions';
import { GitHubProjects } from '../components/cv/GitHubProjects';
import { ProfileCard } from '../components/cv/ProfileCard';
import { SectionHeading } from '../components/cv/SectionHeading';
import { StackSection } from '../components/cv/StackSection';
import {
  aboutMe,
  avatar,
  certificates,
  codingExamples,
  cvBackgroundImage,
  educationInfo,
  experiences,
  githubProfileUrl,
  linkedinProfileUrl,
  stackAndTools,
} from '../data/cv';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { useCvStyles } from '../ThemeProvider';

export default function CV() {
  const { activity, projects, contributions, loading, error } = useGithubProfile();
  const { glassPanelSx } = useCvStyles();

  return (
    <BackgroundPaper image={cvBackgroundImage}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                ...glassPanelSx,
                height: '100%',
                p: { xs: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                borderRadius: 3,
              }}
            >
              <ProfileCard about={aboutMe} avatarSrc={avatar} />

              <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

              <Stack spacing={2}>
                <SectionHeading overline="GitHub" sx={{ mb: 0.5 }} />
                <ContactButtons githubUrl={githubProfileUrl} linkedinUrl={linkedinProfileUrl} />
                <GitHubActivityList activity={activity} loading={loading} error={error} />

                <SectionHeading overline="Open source contributions" sx={{ mt: 1 }} />
                <GitHubContributions contributions={contributions} loading={loading} />

                <SectionHeading overline="Open source projects" sx={{ mt: 1 }} />
                <GitHubProjects projects={projects} />
              </Stack>

              <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

              <SectionHeading overline="Stack & Tools" sx={{ mt: 0.5 }} />
              <StackSection sections={stackAndTools} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                ...glassPanelSx,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 3,
              }}
            >
              <Stack spacing={3.5}>
                <Box>
                  <SectionHeading overline="Experience" title="Roles & Impact" />
                  <ExperienceList experiences={experiences} />
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <SectionHeading overline="Certificates" title="Credentials" />
                  <CertificatesList certificates={certificates} />
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <SectionHeading overline="Education" />
                  <EducationSection education={educationInfo} />
                </Box>

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)' }} />

                <Box>
                  <SectionHeading overline="Coding Examples" title="Selected Work" />
                  <CodingExamplesSection examples={codingExamples} />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </BackgroundPaper>
  );
}
