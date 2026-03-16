import { Box, Typography } from '@mui/material';

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
      <Typography
        variant="body1"
        sx={{
          fontStyle: 'italic',
          lineHeight: 1.75,
          color: 'text.secondary',
          fontSize: '1.05rem',
        }}
      >
        {text}
      </Typography>
      {attribution && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'text.disabled',
            fontStyle: 'normal',
          }}
        >
          — {attribution}
        </Typography>
      )}
    </Box>
  );
}
