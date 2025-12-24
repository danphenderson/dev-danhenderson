import { Box, Grid, Paper } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
  showShell?: boolean;
  contentAlign?: 'flex-start' | 'center' | 'flex-end';
  contentSx?: SxProps<Theme>;
  shellSx?: SxProps<Theme>;
}

const resolveBackgroundImage = (src: string) => {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }

  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const sanitized = src.replace(/^\.\//, '');
  const normalized = sanitized.startsWith('/') ? sanitized : `/${sanitized.replace(/^\/+/, '')}`;

  return `${base}${normalized}`;
};

const BackgroundPaper: React.FC<BackgroundPaperProps> = ({
  image,
  children,
  showShell = true,
  contentAlign = 'flex-start',
  contentSx,
  shellSx,
}) => {
  const resolvedImage = resolveBackgroundImage(image);
  const theme = useTheme();
  const overlayColor = alpha(theme.palette.common.black, theme.palette.mode === 'light' ? 0.4 : 0.6);
  const shellBackground = alpha(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.72 : 0.6);
  const shellBorder = `1px solid ${alpha(theme.palette.divider, 0.5)}`;
  const resolvedContentSx = Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [];
  const resolvedShellSx = Array.isArray(shellSx) ? shellSx : shellSx ? [shellSx] : [];

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          backgroundImage: `url('${resolvedImage}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: overlayColor,
          },
        }}
      >
        <Box
          sx={[
            {
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: contentAlign,
              minHeight: '100vh',
              width: '100%',
              padding: '50px 0',
            },
            ...resolvedContentSx,
          ]}
        >
          {showShell ? (
            <Paper
              elevation={10}
              sx={[
                {
                  backgroundColor: shellBackground,
                  padding: 2,
                  borderRadius: 2,
                  border: shellBorder,
                  boxShadow: theme.shadows[6],
                },
                ...resolvedShellSx,
              ]}
            >
              {children}
            </Paper>
          ) : (
            <Box sx={{ width: '100%' }}>{children}</Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BackgroundPaper;
