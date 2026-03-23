const js = require('@eslint/js');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const playwrightPlugin = require('eslint-plugin-playwright');

const reactRecommended = reactPlugin.configs.flat.recommended;
const reactJsxRuntime = reactPlugin.configs.flat['jsx-runtime'];
const reactHooksRecommended = reactHooksPlugin.configs['flat/recommended'][0];
const playwrightRecommended = playwrightPlugin.configs['flat/recommended'];

const restrictedTypographyImports = [
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
];

module.exports = [
  {
    ignores: ['build/**', 'docs-site/build/**', 'playwright-report/**', 'e2e-results/**'],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,cjs,mjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
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
          paths: restrictedTypographyImports,
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      ...reactHooksRecommended.plugins,
    },
    rules: {
      ...reactHooksRecommended.rules,
    },
  },
  {
    files: ['src/**/*.{tsx,jsx}'],
    plugins: {
      ...reactRecommended.plugins,
      ...reactJsxRuntime.plugins,
    },
    languageOptions: {
      parserOptions: {
        ...(reactRecommended.languageOptions?.parserOptions ?? {}),
        ...(reactJsxRuntime.languageOptions?.parserOptions ?? {}),
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactRecommended.rules,
      ...reactJsxRuntime.rules,
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['src/setupTests.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['vite.config.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
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
    plugins: playwrightRecommended.plugins,
    languageOptions: {
      ...playwrightRecommended.languageOptions,
      globals: {
        ...(playwrightRecommended.languageOptions?.globals ?? {}),
        ...globals.node,
      },
    },
    rules: playwrightRecommended.rules,
  },
];
