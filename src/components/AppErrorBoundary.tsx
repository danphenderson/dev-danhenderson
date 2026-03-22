import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { siteRouteMap } from '../constants/siteRoutes';
import { resolvePublicAssetPath } from '../utils/assets';
import { Text } from './text';

type Props = { children: ReactNode };
type State = { hasError: boolean };

function ErrorFallback() {
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
      <Text role="sectionTitle" component="h1">
        Something went wrong
      </Text>
      <Text role="body" tone="muted">
        An unexpected error occurred. Please try reloading the page.
      </Text>
      <Button variant="outlined" href={homeHref}>
        Return Home
      </Button>
    </Box>
  );
}

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

    return <ErrorFallback />;
  }
}
