import { Stack, Typography } from '@mui/material';
import type { CodingExample } from '../../data/cv';
import { AnimatedContentList } from '../AnimatedContentList';
import { useCvStyles } from '../../styles/cvStyles';

type CodingExamplesSectionProps = {
  examples: CodingExample[];
  startDelayMs?: number;
};

export const CodingExamplesSection = ({ examples, startDelayMs = 0 }: CodingExamplesSectionProps) => {
  const { codingExampleLinkSx } = useCvStyles();

  return (
    <AnimatedContentList
      items={examples}
      getItemKey={(example, index) => `${example.title}-${index}`}
      startDelayMs={startDelayMs}
      stackSpacing={2.25}
      renderItem={(example) => {
        const primaryLink = example.links[0];

        return (
          <>
            <Stack spacing={1.25}>
              {primaryLink ? (
                <Typography
                  variant="h6"
                  component="a"
                  href={primaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={codingExampleLinkSx}
                >
                  {example.title}
                </Typography>
              ) : (
                <Typography variant="h6">{example.title}</Typography>
              )}
              <Typography variant="body2">{example.description}</Typography>
            </Stack>
          </>
        );
      }}
    />
  );
};
