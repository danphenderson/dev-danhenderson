import { Box, Typography } from '@mui/material';
import type { GitHubActivityItem } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { useCvStyles } from '../../ThemeProvider';

type GitHubActivityListProps = {
  activity: GitHubActivityItem[];
  loading: boolean;
  error?: string | null;
};

export const GitHubActivityList = ({ activity, loading, error }: GitHubActivityListProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();

  return (
    <Box>
      {loading ? (
        <LoadingBars label="Loading GitHub activity" compact />
      ) : (
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: 0.75,
          }}
        >
          {activity.map((item, idx) => (
            <Box
              key={`${item.label}-${idx}`}
              component="li"
              sx={{
                listStyle: 'none',
              }}
            >
              {item.href ? (
                <Box
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    padding: 0.75,
                    borderRadius: 1.5,
                    border: subtleBorder,
                    backgroundColor: subtleSurface,
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {item.label}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    padding: 0.75,
                    borderRadius: 1.5,
                    border: subtleBorder,
                    backgroundColor: subtleSurface,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {item.label}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="text.secondary">
          {error}
        </Typography>
      )}
    </Box>
  );
};
