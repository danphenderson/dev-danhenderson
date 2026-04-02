import { Fragment, type ReactNode } from 'react';
import { Box, type Theme } from '@mui/material';

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
const pythonInlineHighlightSignals = [
  /\b(?:Any|False|None|Optional|True|Union)\b/,
  /\b(?:async|await|class|def|from|import|lambda|return|yield)\b/,
  /\btyping\./,
  /\|\s*None\b/,
  /=\s*None\b/,
  /^[A-Z][A-Za-z0-9_]*(?:\[[^\]]+\])?$/,
];

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

export function shouldHighlightInlinePython(code: string) {
  return pythonInlineHighlightSignals.some((pattern) => pattern.test(code));
}

export function renderHighlightedPython(code: string): ReactNode {
  return tokenizePython(code).map((token, index) => {
    const tokenKind = token.kind;

    if (tokenKind === 'plain') {
      return <Fragment key={index}>{token.value}</Fragment>;
    }

    return (
      <Box
        key={index}
        component="span"
        data-token-kind={tokenKind}
        sx={(theme) => ({
          color: getPythonTokenColor(theme, tokenKind),
          fontStyle: tokenKind === 'comment' ? 'italic' : 'normal',
        })}
      >
        {token.value}
      </Box>
    );
  });
}

export function renderHighlightedCode(language: string, code: string): ReactNode {
  const normalizedLanguage = language.trim().toLowerCase();

  if (normalizedLanguage === 'python' || normalizedLanguage === 'py') {
    return renderHighlightedPython(code);
  }

  return code;
}
