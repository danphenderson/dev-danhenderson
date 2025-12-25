import { Stack, Typography } from '@mui/material';
import type { CodingExample } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
};

export const CodingExamplesSection = ({ examples }: CodingExamplesSectionProps) => (
  <Stack spacing={1.5}>
    {examples.map((example, index) => {
      const primaryLink = example.links[0];

      return (
        <AnimatedContentCard key={`${example.title}-${index}`} delayMs={index * 80}>
          {primaryLink ? (
            <Typography
              variant="h6"
              component="a"
              href={primaryLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
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
        </AnimatedContentCard>
      );
    })}
  </Stack>
);
