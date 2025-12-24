import { Stack, Typography } from '@mui/material';
import type { CodingExample } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
};

export const CodingExamplesSection = ({ examples }: CodingExamplesSectionProps) => (
  <Stack spacing={1.5}>
    {examples.map((example, index) => (
      <AnimatedContentCard key={`${example.title}-${index}`} delayMs={index * 80}>
        <Typography variant="h6">{example.title}</Typography>
        <Typography variant="body2">{example.description}</Typography>
        <Stack spacing={0.25} sx={{ mt: 0.5 }}>
          {example.links.map((link, linkIndex) => (
            <Typography key={`${link}-${linkIndex}`} variant="body2">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </Typography>
          ))}
        </Stack>
      </AnimatedContentCard>
    ))}
  </Stack>
);
