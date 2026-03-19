import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'danhenderson.dev docs',
  tagline:
    'Architecture and implementation reference for a motion-rich React + TypeScript portfolio',
  favicon: 'img/favicon.svg',

  // GitHub Pages project page: url = GitHub Pages domain, baseUrl = /repo-name/
  // For a custom domain (e.g. docs.danhenderson.dev), set url to that domain and baseUrl to '/'
  url: 'https://danphenderson.github.io',
  baseUrl: '/dev-danhenderson/',

  organizationName: 'danphenderson',
  projectName: 'dev-danhenderson',

  // Source-code links (../src/…) and repo-root references (../../AGENTS.md)
  // in authored docs are intentionally preserved for raw-markdown readers
  // but won't resolve in the rendered site.
  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/danphenderson/dev-danhenderson/edit/main/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'danhenderson.dev',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://danhenderson.dev',
          label: 'Live Site',
          position: 'right',
        },
        {
          href: 'https://github.com/danphenderson/dev-danhenderson',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Project Overview', to: '/project/overview' },
            { label: 'App Architecture', to: '/architecture/app-architecture' },
            { label: 'Design System', to: '/design-system-reference' },
          ],
        },
        {
          title: 'Frontend',
          items: [
            { label: 'Components', to: '/frontend/component-architecture' },
            { label: 'Motion', to: '/frontend/motion-architecture' },
            { label: 'Theme & Styling', to: '/frontend/theme-and-styling' },
            { label: 'Page Choreography', to: '/frontend/page-choreography' },
          ],
        },
        {
          title: 'Links',
          items: [
            { label: 'Live Site', href: 'https://danhenderson.dev' },
            {
              label: 'GitHub',
              href: 'https://github.com/danphenderson/dev-danhenderson',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Daniel Henderson`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'tsx', 'typescript'],
    },

    mermaid: {
      theme: { light: 'default', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
