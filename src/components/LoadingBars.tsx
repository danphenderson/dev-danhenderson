import { keyframes } from '@emotion/react';
import { LinearProgress, Stack } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const barHeight = compact ? 4 : 6;
  const barSpacing = compact ? 0.75 : 1;
  const bars = [
    { tone: 'primary', delay: 0 },
    { tone: 'secondary', delay: 200 },
    { tone: 'success', delay: 400 },
  ] as const;

  return (
    <Stack role="status" aria-live="polite" aria-label={label} spacing={barSpacing}>
      {bars.map((bar) => {
        const palette = theme.palette[bar.tone];
        const trackColor = alpha(palette.main, theme.palette.mode === 'light' ? 0.16 : 0.25);

        return (
          <LinearProgress
            key={bar.tone}
            variant="determinate"
            value={100}
            aria-hidden={true}
            sx={{
              height: barHeight,
              borderRadius: 999,
              backgroundColor: trackColor,
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                backgroundColor: palette.main,
                animation: `${pulse} 1.6s ease-in-out infinite`,
                animationDelay: `${bar.delay}ms`,
              },
            }}
          />
        );
      })}
    </Stack>
  );
};
