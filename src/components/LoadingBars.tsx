import { keyframes } from '@emotion/react';
import { LinearProgress, Stack } from '@mui/material';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useAppStyles } from '../styles/appStyles';

type LoadingBarsProps = {
  label?: string;
  compact?: boolean;
};

const pulse = keyframes`
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
`;

export const LoadingBars = ({ label = 'Loading', compact = false }: LoadingBarsProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const appStyles = useAppStyles();
  const barHeight = compact ? 4 : 6;
  const barSpacing = compact ? 0.75 : 1;
  const pulseAnimation = prefersReducedMotion ? 'none' : `${pulse} 1.6s ease-in-out infinite`;
  const bars = [
    { tone: 'primary', delay: 0 },
    { tone: 'secondary', delay: 200 },
    { tone: 'success', delay: 400 },
  ] as const;

  return (
    <Stack role="status" aria-live="polite" aria-label={label} spacing={barSpacing}>
      {bars.map((bar) => {
        const { barColor, trackColor } = appStyles.getLoadingBarToneColors(bar.tone);

        return (
          <LinearProgress
            key={bar.tone}
            variant="determinate"
            value={100}
            aria-hidden={true}
            sx={appStyles.getLoadingBarSx({
              height: barHeight,
              trackColor,
              barColor,
              animation: pulseAnimation,
              animationDelay: prefersReducedMotion ? '0ms' : `${bar.delay}ms`,
            })}
          />
        );
      })}
    </Stack>
  );
};
