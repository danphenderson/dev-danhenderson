import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Explicit sidebar structure for the documentation site.
 *
 * Document IDs are derived from file paths relative to the docs directory
 * (../docs from the perspective of the Docusaurus site).
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'doc',
      id: 'README',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Project',
      items: ['project/overview'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: ['architecture/app-architecture'],
    },
    {
      type: 'category',
      label: 'Frontend',
      items: [
        'frontend/component-architecture',
        'frontend/motion-architecture',
        'frontend/theme-and-styling',
        'frontend/page-choreography',
      ],
    },
    {
      type: 'category',
      label: 'Engineering',
      items: ['engineering/agent-guide', 'engineering/testing-strategy'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: ['design-system-reference'],
    },
  ],
};

export default sidebars;
