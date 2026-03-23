module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    es2022: true,
  },
  ignorePatterns: ['build/', 'docs-site/build/', 'playwright-report/', 'e2e-results/'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material/Typography',
            message:
              'Use Text from src/components/text instead. If you need raw Typography, use UnsafeTypography with required metadata.',
          },
          {
            name: '@mui/material',
            importNames: ['Typography'],
            message:
              'Use Text from src/components/text instead. If you need raw Typography, use UnsafeTypography with required metadata.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.{ts,tsx,js,jsx}'],
      env: {
        browser: true,
      },
    },
    {
      files: ['src/**/*.{tsx,jsx}'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended-legacy',
      ],
      rules: {
        'react/no-unescaped-entities': 'off',
        'react/prop-types': 'off',
      },
    },
    {
      files: ['src/setupTests.ts'],
      env: {
        browser: true,
        jest: true,
      },
    },
    {
      files: ['scripts/**/*.{js,cjs,mjs}', 'vite.config.ts', 'playwright.config.ts'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
    {
      files: ['src/components/text/Text.tsx', 'src/components/text/UNSAFE_Typography.tsx'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
    {
      files: ['test/e2e/**/*.{ts,tsx}'],
      env: {
        node: true,
      },
      extends: ['plugin:playwright/recommended'],
    },
  ],
};
