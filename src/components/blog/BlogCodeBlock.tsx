import { Fragment, type ReactNode, useState, useCallback } from 'react';
import { Box, IconButton, Stack, Tooltip, type Theme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Text } from '../text';
import { useComponentStyles } from '../../styles/componentStyles';

type BlogCodeBlockProps = {
  language: string;
  code: string;
  filename?: string;
  caption?: string;
};

type PythonTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'type'
  | 'function'
  | 'constant'
  | 'decorator'
  | 'number';

type PythonToken = {
  kind: PythonTokenKind;
  value: string;
};

const pythonKeywordPattern =
  /^(?:and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|finally|for|from|if|import|in|is|lambda|match|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/;
const pythonIdentifierPattern = /^[A-Za-z_][A-Za-z0-9_]*/;
const pythonNumberPattern = /^\d+(?:_\d+)*(?:\.\d+)?/;
const pythonStringPattern = /^(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")/;
const pythonDecoratorPattern = /^@[A-Za-z_][A-Za-z0-9_.]*/;

const pythonConstants = new Set(['False', 'None', 'True']);
const pythonTypes = new Set([
  'Any',
  'Callable',
  'ClassVar',
  'Dict',
  'Final',
  'Iterable',
  'Iterator',
  'List',
  'Literal',
  'Mapping',
  'Optional',
  'Sequence',
  'Set',
  'Tuple',
  'Type',
  'TypeAlias',
  'Union',
  'bool',
  'bytes',
  'dict',
  'float',
  'frozenset',
  'int',
  'list',
  'object',
  'set',
  'str',
  'tuple',
]);

function getPythonTokenColor(theme: Theme, kind: Exclude<PythonTokenKind, 'plain'>) {
  const palette =
    theme.palette.mode === 'dark'
      ? {
          comment: '#6a9955',
          string: '#ce9178',
          keyword: '#569cd6',
          type: '#4ec9b0',
          function: '#dcdcaa',
          constant: '#4fc1ff',
          decorator: '#c586c0',
          number: '#b5cea8',
        }
      : {
          comment: '#6a737d',
          string: '#a31515',
          keyword: '#005cc5',
          type: '#116329',
          function: '#795e26',
          constant: '#005cc5',
          decorator: '#6f42c1',
          number: '#098658',
        };

  return palette[kind];
}

function pushPythonToken(tokens: PythonToken[], kind: PythonTokenKind, value: string) {
  if (!value) {
    return;
  }

  const previousToken = tokens[tokens.length - 1];
  if (previousToken && previousToken.kind === kind) {
    previousToken.value += value;
    return;
  }

  tokens.push({ kind, value });
}

function tokenizePython(code: string): PythonToken[] {
  const tokens: PythonToken[] = [];
  let cursor = 0;
  let expectFunctionName = false;
  let expectClassName = false;

  while (cursor < code.length) {
    const remaining = code.slice(cursor);

    const whitespaceMatch = remaining.match(/^\s+/);
    if (whitespaceMatch) {
      pushPythonToken(tokens, 'plain', whitespaceMatch[0]);
      cursor += whitespaceMatch[0].length;
      continue;
    }

    const commentMatch = remaining.match(/^#[^\n]*/);
    if (commentMatch) {
      pushPythonToken(tokens, 'comment', commentMatch[0]);
      cursor += commentMatch[0].length;
      continue;
    }

    const stringMatch = remaining.match(pythonStringPattern);
    if (stringMatch) {
      pushPythonToken(tokens, 'string', stringMatch[0]);
      cursor += stringMatch[0].length;
      continue;
    }

    const decoratorMatch = remaining.match(pythonDecoratorPattern);
    if (decoratorMatch) {
      pushPythonToken(tokens, 'decorator', decoratorMatch[0]);
      cursor += decoratorMatch[0].length;
      continue;
    }

    const keywordMatch = remaining.match(pythonKeywordPattern);
    if (keywordMatch) {
      const keyword = keywordMatch[0];
      pushPythonToken(tokens, 'keyword', keyword);
      cursor += keyword.length;
      expectFunctionName = keyword === 'def';
      expectClassName = keyword === 'class';
      continue;
    }

    const numberMatch = remaining.match(pythonNumberPattern);
    if (numberMatch) {
      pushPythonToken(tokens, 'number', numberMatch[0]);
      cursor += numberMatch[0].length;
      continue;
    }

    const identifierMatch = remaining.match(pythonIdentifierPattern);
    if (identifierMatch) {
      const identifier = identifierMatch[0];

      if (expectFunctionName) {
        pushPythonToken(tokens, 'function', identifier);
        expectFunctionName = false;
        cursor += identifier.length;
        continue;
      }

      if (expectClassName) {
        pushPythonToken(tokens, 'type', identifier);
        expectClassName = false;
        cursor += identifier.length;
        continue;
      }

      if (pythonConstants.has(identifier)) {
        pushPythonToken(tokens, 'constant', identifier);
      } else if (pythonTypes.has(identifier) || /^[A-Z][A-Za-z0-9_]*$/.test(identifier)) {
        pushPythonToken(tokens, 'type', identifier);
      } else {
        pushPythonToken(tokens, 'plain', identifier);
      }

      cursor += identifier.length;
      continue;
    }

    pushPythonToken(tokens, 'plain', remaining[0]);
    cursor += 1;
  }

  return tokens;
}

function renderHighlightedPython(code: string): ReactNode {
  return tokenizePython(code).map((token, index) => {
    if (token.kind === 'plain') {
      return <Fragment key={index}>{token.value}</Fragment>;
    }

    return (
      <Box
        key={index}
        component="span"
        data-token-kind={token.kind}
        sx={(theme) => ({
          color: getPythonTokenColor(theme, token.kind),
          fontStyle: token.kind === 'comment' ? 'italic' : 'normal',
        })}
      >
        {token.value}
      </Box>
    );
  });
}

function renderCode(language: string, code: string): ReactNode {
  if (language.toLowerCase() === 'python' || language.toLowerCase() === 'py') {
    return renderHighlightedPython(code);
  }

  return code;
}

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
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.035)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {filename && (
              <Text
                role="caption"
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.72rem',
                }}
              >
                {filename}
              </Text>
            )}
            <Text
              role="caption"
              component="span"
              sx={{
                fontFamily: 'monospace',
                color: 'text.disabled',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {language}
            </Text>
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
          <Box component="code" sx={{ display: 'block', whiteSpace: 'pre' }}>
            {renderCode(language, code)}
          </Box>
        </Box>
      </Box>

      {caption && (
        <Text
          role="proseCaption"
          tone="muted"
          component="span"
          sx={{
            display: 'block',
            mt: 1,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {caption}
        </Text>
      )}
    </Box>
  );
}
