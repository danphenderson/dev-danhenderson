import { Box } from '@mui/material';
import { Text } from '../text';

type BlogBlockquoteProps = {
  text: string;
  attribution?: string;
};

export function BlogBlockquote({ text, attribution }: BlogBlockquoteProps) {
  return (
    <Box
      component="blockquote"
      sx={{
        my: 2.5,
        mx: 0,
        pl: 3,
        py: 1,
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        position: 'relative',
      }}
    >
      <Text
        role="proseQuote"
        tone="muted"
        sx={{
          fontStyle: 'italic',
          lineHeight: 1.75,
          fontSize: '1.05rem',
        }}
      >
        {text}
      </Text>
      {attribution && (
        <Text
          role="proseCaption"
          tone="muted"
          sx={{
            display: 'block',
            mt: 1,
            color: 'text.disabled',
            fontStyle: 'normal',
          }}
        >
          — {attribution}
        </Text>
      )}
    </Box>
  );
}
