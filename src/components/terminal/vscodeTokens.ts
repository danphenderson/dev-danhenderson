/**
 * Design tokens for the VSCode-chrome terminal hero shell.
 * All values are pure constants — no runtime logic or theme access.
 */

export const monoFontFamily = '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace';

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export const VSCODE_COLORS = {
  // Zone backgrounds
  titleBarBg: '#1a1a1a',
  activityBarBg: '#222222',
  tabBarBg: '#2d2d2d',
  activeTabBg: '#1e1e1e',
  inactiveTabBg: '#2d2d2d',
  editorBg: '#1e1e1e',
  terminalHeaderBg: '#252525',
  terminalBg: '#181818',

  // Borders
  titleBorder: 'rgba(255,255,255,0.08)',
  tabBorder: 'rgba(255,255,255,0.08)',
  panelBorder: 'rgba(255,255,255,0.10)',

  // Active tab top accent
  activeTabAccent: '#007acc',

  // Syntax highlight palette (VSCode Dark+ inspired)
  syntaxKeyword: '#569cd6',
  syntaxString: '#ce9178',
  syntaxFunction: '#dcdcaa',
  syntaxVariable: '#9cdcfe',
  syntaxComment: '#6a9955',
  syntaxPunct: '#d4d4d4',
  syntaxTypeAnnotation: '#4ec9b0',

  // UI chrome text
  lineNumber: 'rgba(255,255,255,0.28)',
  inactiveTab: 'rgba(255,255,255,0.45)',
  panelLabel: 'rgba(255,255,255,0.55)',
  titleLabel: 'rgba(255,255,255,0.40)',
  foreground: 'rgba(255,255,255,0.92)',

  // macOS-style window control dots
  dotRed: '#ff5f57',
  dotYellow: '#febc2e',
  dotGreen: '#28c840',

  // Git diff gutter markers
  gutterAdd: '#28c840',

  // Minimap
  minimapBg: '#1a1a1a',

  // Breadcrumb
  breadcrumbBg: '#252526',
  breadcrumbSep: 'rgba(255,255,255,0.30)',

  // Explorer sidebar
  explorerBg: '#252526',
  explorerItemHover: 'rgba(255,255,255,0.06)',
  explorerItemActive: 'rgba(255,255,255,0.10)',

  // Command palette
  commandPaletteBg: '#252526',
  commandPaletteInputBg: '#3c3c3c',
  commandPaletteItemHover: 'rgba(0,122,204,0.30)',
  commandPaletteSeparator: 'rgba(255,255,255,0.06)',

  // Fold gutter
  foldIndicator: 'rgba(255,255,255,0.35)',

  // Status bar dropdown
  statusDropdownBg: '#252526',

  // Terminal prompt colors
  promptPath: 'rgba(255,255,255,0.40)',
  promptDollar: '#28c840',
  promptBranch: '#e5c07b',
  outputText: 'rgba(255,255,255,0.58)',
} as const;

// ---------------------------------------------------------------------------
// Layout dimensions (px)
// ---------------------------------------------------------------------------

export const VSCODE_LAYOUT = {
  titleBarHeight: 32,
  activityBarWidth: 40,
  tabBarHeight: 35,
  panelHeaderHeight: 28,
  statusBarHeight: 22,
  lineNumberWidth: '2ch',
  lineNumberGutter: 12, // px gap between line number and code
  breadcrumbHeight: 22,
  gutterWidth: 4,
  minimapWidth: 48,
  explorerWidth: 160,
  commandPaletteWidth: 420,
  foldGutterWidth: 14,
} as const;
