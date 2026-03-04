import { Stack, Typography } from '@mui/material';
import type { CodingExample } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { useCvStyles } from '../../ThemeProvider';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
  startDelayMs?: number;
};
const experienceStaggerMs = 80;


export const CodingExamplesSection = ({ examples, startDelayMs = 0 }: CodingExamplesSectionProps) => {
  const { accentColor, accentTint } = useCvStyles();

  return (
    <Stack spacing={2.25}>
      {examples.map((example, index) => {
        const primaryLink = example.links[0];
        return (
          <AnimatedContentCard
            key={`${example.title}-${index}`}
            delayMs={startDelayMs + index * experienceStaggerMs}
          >
            <Stack spacing={1.25}>
          {primaryLink ? (
            <Typography
              variant="h6"
              component="a"
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: accentColor,
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {example.title}
            </Typography>
          ) : (
            <Typography variant="h6">{example.title}</Typography>
          )}
            <Typography variant="body2">{example.description}</Typography>
          </Stack>
        </AnimatedContentCard>
        );
      })}
    </Stack>
  );
}
