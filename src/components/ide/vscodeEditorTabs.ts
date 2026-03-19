import type { VscodeEditorTab } from '../../types/ui';
import { VSCODE_COLORS } from './vscodeTokens';

export interface VscodeEditorTabMetadata {
  id: VscodeEditorTab;
  fileName: string;
  badgeLabel: string;
  badgeColor: string;
  badgeTextColor: string;
  breadcrumbs: string[];
  languageMode: string;
  languageOptions: readonly string[];
}

export const VSCODE_EDITOR_TAB_ORDER: readonly VscodeEditorTab[] = ['server', 'client'];

export const VSCODE_EDITOR_TAB_METADATA: Record<VscodeEditorTab, VscodeEditorTabMetadata> = {
  server: {
    id: 'server',
    fileName: 'server.py',
    badgeLabel: 'PY',
    badgeColor: VSCODE_COLORS.fileTypePython,
    badgeTextColor: '#1f1f1f',
    breadcrumbs: ['src', 'server.py', 'app'],
    languageMode: 'Python',
    languageOptions: ['Python', 'TypeScript', 'JavaScript', 'JSON', 'Markdown'],
  },
  client: {
    id: 'client',
    fileName: 'client.tsx',
    badgeLabel: 'TS',
    badgeColor: VSCODE_COLORS.fileTypeTs,
    badgeTextColor: '#ffffff',
    breadcrumbs: ['src', 'client.tsx', 'main'],
    languageMode: 'TypeScript',
    languageOptions: ['TypeScript', 'JavaScript', 'JSON', 'Markdown', 'Python'],
  },
};

export const VSCODE_EDITOR_TABS = VSCODE_EDITOR_TAB_ORDER.map(
  (tabId) => VSCODE_EDITOR_TAB_METADATA[tabId]
);

export const getVscodeEditorTabMetadata = (tab: VscodeEditorTab): VscodeEditorTabMetadata =>
  VSCODE_EDITOR_TAB_METADATA[tab];
