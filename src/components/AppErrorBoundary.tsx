import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { siteRouteMap } from '../constants/siteRoutes';
import { resolvePublicAssetPath } from '../utils/assets';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught render error:', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const homeHref = resolvePublicAssetPath(siteRouteMap.home.path);

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          Something went wrong
        </Typography>
        <Typography color="text.secondary">
          An unexpected error occurred. Please try reloading the page.
        </Typography>
        <Button variant="outlined" href={homeHref}>
          Return Home
        </Button>
      </Box>
    );
  }
}
