import { Box, Chip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useCvStyles } from '../../ThemeProvider';
import type { GitHubProject } from '../../data/cv';

type GitHubProjectsProps = {
  projects: GitHubProject[];
};

export const GitHubProjects = ({ projects }: GitHubProjectsProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
      {projects.map((project) => (
        <Chip
          key={project.name}
          icon={<GitHubIcon />}
          label={project.name}
          component="a"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          clickable
          size="small"
          variant="outlined"
          sx={{
            border: subtleBorder,
            backgroundColor: subtleSurface,
            fontWeight: 600,
            color: 'text.primary',
            height: 'auto',
            justifyContent: 'flex-start',
            alignItems: 'center',
            '& .MuiChip-icon': {
              alignSelf: 'center',
              marginLeft: 0.5,
              marginRight: 0.5,
              fontSize: 18,
              color: 'text.secondary',
            },
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              textOverflow: 'clip',
              lineHeight: 1.4,
              px: 1,
              py: 0.25,
              overflowWrap: 'anywhere',
            },
          }}
        />
      ))}
    </Box>
  );
};
