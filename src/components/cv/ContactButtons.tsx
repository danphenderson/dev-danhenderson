import { Button, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

type ContactButtonsProps = {
  githubUrl: string;
  linkedinUrl: string;
};

export const ContactButtons = ({ githubUrl, linkedinUrl }: ContactButtonsProps) => (
  <Stack spacing={1.25} sx={{ mt: 1 }}>
    <Button
      variant="text"
      color="primary"
      href={githubUrl}
      target="_blank"
      startIcon={<GitHubIcon />}
      sx={{ textTransform: 'none', alignSelf: 'flex-start', paddingX: 0 }}
    >
      View GitHub
    </Button>
    <Button
      variant="text"
      color="primary"
      href={linkedinUrl}
      target="_blank"
      startIcon={<LinkedInIcon />}
      sx={{ textTransform: 'none', alignSelf: 'flex-start', paddingX: 0 }}
    >
      View LinkedIn
    </Button>
  </Stack>
);
