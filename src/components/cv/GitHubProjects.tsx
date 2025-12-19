import { Box, Chip } from '@mui/material';
import type { GitHubProject } from '../../data/cv';

type GitHubProjectsProps = {
  projects: GitHubProject[];
};

export const GitHubProjects = ({ projects }: GitHubProjectsProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
    {projects.map((project) => (
      <Chip
        key={project.name}
        label={project.name}
        component="a"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        clickable
        size="small"
        variant="outlined"
        sx={{
          borderColor: 'rgba(15,23,42,0.12)',
          backgroundColor: 'rgba(255,255,255,0.9)',
          fontWeight: 600,
          color: '#0f172a',
        }}
      />
    ))}
  </Box>
);
