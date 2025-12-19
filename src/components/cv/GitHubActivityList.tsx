import { Box, Typography } from '@mui/material';
import type { GitHubActivityItem } from '../../data/cv';
import { useCvStyles } from '../../ThemeProvider';

type GitHubActivityListProps = {
  activity: GitHubActivityItem[];
  loading: boolean;
  error?: string | null;
};

export const GitHubActivityList = ({ activity, loading, error }: GitHubActivityListProps) => {
  const { accentColor, linkStyle } = useCvStyles();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color: '#0f172a', mb: 0.5 }}>
        Recent activity
      </Typography>
      {loading ? (
        <Typography variant="body2" color="text.secondary">
          Loading activity...
        </Typography>
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
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                padding: 0.75,
                borderRadius: 1.5,
                border: '1px solid rgba(15,23,42,0.08)',
                backgroundColor: 'rgba(255,255,255,0.9)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: '#0f172a' }}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...linkStyle, textDecoration: 'underline' }}
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="textSecondary">
          {error}
        </Typography>
      )}
    </Box>
  );
};
