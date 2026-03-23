import { LinearProgress, Stack } from '@mui/material';
import { useAppStyles } from '../styles/appStyles';
import { loadingPulse } from '../styles/animations';
import { useComponentStyles } from '../styles/componentStyles';

type LoadingBarsProps = {
  label?: string;
  compact?: boolean;
};

export const LoadingBars = ({ label = 'Loading', compact = false }: LoadingBarsProps) => {
  const appStyles = useAppStyles();
  const { motionTokens } = useComponentStyles();
  const barHeight = compact ? 4 : 6;
  const barSpacing = compact ? 0.75 : 1;
  const pulseAnimation = `${loadingPulse} ${motionTokens.loadingPulseDurationMs}ms ease-in-out infinite`;
  const bars = [
    { tone: 'primary', delay: 0 },
    { tone: 'secondary', delay: motionTokens.loadingBarStaggerMs },
    { tone: 'success', delay: motionTokens.loadingBarStaggerMs * 2 },
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
              animationDelay: `${bar.delay}ms`,
            })}
          />
        );
      })}
    </Stack>
  );
};
