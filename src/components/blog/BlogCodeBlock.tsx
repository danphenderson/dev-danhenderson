import { useState, useCallback } from 'react';
import { Box, IconButton, Stack, Typography, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useComponentStyles } from '../../styles/componentStyles';

type BlogCodeBlockProps = {
  language: string;
  code: string;
  filename?: string;
  caption?: string;
};

export function BlogCodeBlock({ language, code, filename, caption }: BlogCodeBlockProps) {
  const componentStyles = useComponentStyles();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <Box sx={{ my: 2 }}>
      <Box
        sx={{
          ...componentStyles.contentCardSx,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
        }}
      >
        {/* Header bar */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {filename && (
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.72rem',
                }}
              >
                {filename}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'monospace',
                color: 'text.disabled',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {language}
            </Typography>
          </Stack>
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              aria-label="Copy code to clipboard"
              sx={{ color: 'text.secondary', p: 0.5 }}
            >
              {copied ? (
                <CheckIcon sx={{ fontSize: 16 }} />
              ) : (
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Code content */}
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: 1.65,
            color: 'text.primary',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 3,
            },
          }}
        >
          <Box component="code">{code}</Box>
        </Box>
      </Box>

      {caption && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'text.secondary',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {caption}
        </Typography>
      )}
    </Box>
  );
}
