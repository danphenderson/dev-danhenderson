/**
 * Design tokens for the VSCode-chrome terminal hero shell.
 * All values are pure constants — no runtime logic or theme access.
 */

export const monoFontFamily = '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace';

// System UI font for window chrome labels (title bar, panel headers)
export const systemFontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

export const VSCODE_COLORS = {
  // Zone backgrounds — subtle depth progression from outer to inner
  titleBarBg: '#323233',
  activityBarBg: '#2c2c2d',
  tabBarBg: '#252526',
  activeTabBg: '#1e1e1e',
  inactiveTabBg: '#2d2d2d',
  editorBg: '#1e1e1e',
  terminalHeaderBg: '#383838',
  terminalBg: '#1a1a1a',

  // Borders — consistent subtle separation
  titleBorder: 'rgba(0,0,0,0.35)',
  tabBorder: 'rgba(0,0,0,0.25)',
  panelBorder: 'rgba(0,0,0,0.30)',
  sashBorder: 'rgba(255,255,255,0.04)',

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
  lineNumber: 'rgba(255,255,255,0.22)',
  lineNumberActive: 'rgba(255,255,255,0.80)',
  inactiveTab: 'rgba(255,255,255,0.50)',
  panelLabel: 'rgba(255,255,255,0.60)',
  titleLabel: 'rgba(255,255,255,0.65)',
  foreground: 'rgba(255,255,255,0.92)',

  // macOS-style window control dots
  dotRed: '#ff5f57',
  dotYellow: '#febc2e',
  dotGreen: '#28c840',

  // Git diff gutter markers
  gutterAdd: '#28c840',

  // Minimap
  minimapBg: '#232323',

  // Breadcrumb
  breadcrumbBg: '#1e1e1e',
  breadcrumbSep: 'rgba(255,255,255,0.25)',
  breadcrumbText: 'rgba(255,255,255,0.50)',

  // Explorer sidebar
  explorerBg: '#252526',
  explorerItemHover: 'rgba(255,255,255,0.06)',
  explorerItemActive: 'rgba(255,255,255,0.10)',

  // File-type icon colors (used in explorer sidebar and tab bar)
  fileTypeTs: '#3178c6',
  fileTypePython: '#e5c07b',
  fileTypeFolder: '#dcb67a',
  fileTypeJson: '#e6c07b',

  // Command palette
  commandPaletteBg: '#252526',
  commandPaletteInputBg: '#3c3c3c',
  commandPaletteItemHover: 'rgba(0,122,204,0.30)',
  commandPaletteSeparator: 'rgba(255,255,255,0.06)',

  // Fold gutter
  foldIndicator: 'rgba(255,255,255,0.35)',

  // Status bar
  statusBarBg: '#007acc',
  statusDropdownBg: '#252526',

  // Terminal prompt colors
  promptPath: 'rgba(255,255,255,0.40)',
  promptDollar: '#28c840',
  promptArrow: '#28c840',
  promptBranch: '#e5c07b',
  outputText: 'rgba(255,255,255,0.82)',

  // Hover / focus-visible affordances
  iconHover: 'rgba(255,255,255,0.10)',
  tabCloseHover: 'rgba(255,255,255,0.15)',
} as const;

// ---------------------------------------------------------------------------
// Layout dimensions (px)
// ---------------------------------------------------------------------------

export const VSCODE_LAYOUT = {
  titleBarHeight: 38,
  activityBarWidth: 48,
  tabBarHeight: 36,
  panelHeaderHeight: 30,
  statusBarHeight: 24,
  editorColumnWidth: 'clamp(15rem, 70vw, 30rem)',
  lineNumberWidth: '3ch',
  lineNumberGutter: 16, // px gap between line number and code
  breadcrumbHeight: 24,
  gutterWidth: 3,
  minimapWidth: 54,
  explorerWidth: 170,
  commandPaletteWidth: 440,
  foldGutterWidth: 16,
  /** Number of visible lines in the terminal body; drives the fixed height calc */
  terminalBodyLines: 5,
} as const;

// ---------------------------------------------------------------------------
// Outer window shadow for the desktop-app look
// ---------------------------------------------------------------------------

export const VSCODE_WINDOW_SHADOW = '0 8px 40px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.35)';
export const VSCODE_WINDOW_RADIUS = 8;

// ---------------------------------------------------------------------------
// Resize handle constants
// ---------------------------------------------------------------------------

export const VSCODE_RESIZE = {
  /** Width of the invisible hit-area along each edge (px) */
  handleSize: 6,
  /** Minimum window width (px) */
  minWidth: 280,
  /** Minimum window height (px) */
  minHeight: 220,
  /** Sash highlight color on hover (VS Code sash-active blue) */
  sashHoverColor: 'rgba(0, 122, 204, 0.50)',
} as const;
