# Terminal Panel — POC to Production Polish

## Goal

Elevate `VscodeTerminalPanel` from a proof-of-concept to a production-quality component that visually
matches a real VS Code integrated terminal. The prompt structure, output legibility, output colorization,
and depth hierarchy should all be credible at a glance.

## Why

The current panel has several POC-era gaps:

- Panel header labels use `textTransform: uppercase` — VS Code renders these in mixed case
- The prompt uses `○ ` + `> ` — an ad-hoc placeholder; the design language calls for `○ ❯` matching
  modern Powerlevel10k/Oh-My-Zsh conventions (as shown in the reference screenshot)
- The working directory path shows `~/Desktop/dev-danhenderson` — the shorter `~/dev-danhenderson`
  is both visually cleaner and accurate to the zsh `~` expansion
- The `+30` staged file count in `GitStatusLine` is implausible for a polished tip commit
- `outputText` opacity `0.55` makes output indistinguishable from inactive chrome — real terminal
  output should be near full brightness
- The cursor character `▊` (left-half block) should be `█` (full block)
- History commands have identical visual weight to the active prompt — no visual depth hierarchy
- Multi-line outputs like `brew ls` and `node --version` are rendered in a flat dim color; a real
  terminal applies syntax color cues to well-known output patterns
- The terminal body height `calc(8.5em + 16px)` is a raw magic number

## Constraints

- Scope is strictly `src/components/terminal/VscodeTerminalPanel.tsx` and
  `src/components/terminal/vscodeTokens.ts`. Do not touch any other terminal sub-component.
- Do not change the `VscodeTerminalPanelProps` interface (no new props).
- Do not alter the typewriter hook, `TerminalHeroContent`, or `Home.tsx`.
- Preserve the `isCommandPhase` / `isOutputPhase` exports — they are used by consumers.
- `prefers-reduced-motion` support is out of scope for this change.
- No new dependencies.

## Affected files and responsibilities

- `src/components/terminal/VscodeTerminalPanel.tsx` — all prompt, cursor, colorizer, depth, and
  animation changes
- `src/components/terminal/vscodeTokens.ts` — three targeted token changes: `outputText` opacity
  bump, `promptArrow` semantic alias, `terminalBodyLines` layout constant

## Proposed approach

Apply all changes as a single-pass patch to the two files, grouped into four phases. The
`colorizeOutputLine()` pure function is added at module level in `VscodeTerminalPanel.tsx` — no new
file, no abstraction overhead.

## Execution steps

### Phase 1 — Visual accuracy

1. **Remove `textTransform: 'uppercase'`** from both the active "Terminal" tab `sx` block and the
   `['Problems', 'Output']` mapped tab `sx` block in the panel header.

2. **Replace `> ` prompt prefix with `❯ `**:

   - Add `promptArrow: '#28c840'` as a semantic alias in `VSCODE_COLORS` (same green as
     `promptDollar`; two names, one value so each reads clearly at the call site)
   - In both the history block and the active prompt block, replace the `> ` span with `❯ ` using
     `VSCODE_COLORS.promptArrow` for the active prompt and `rgba(255,255,255,0.35)` for history
   - Retain the `○` span using `VSCODE_COLORS.lineNumber` exactly as-is

3. **Shorten `GitStatusLine` working directory** from `~/Desktop/dev-danhenderson` to
   `~/dev-danhenderson`.

4. **Fix staged file count**: change `+30` to `+3` in `GitStatusLine`.

5. **Change cursor character** `▊` → `█` in both cursor `Box` spans.

6. **Bump `outputText` opacity** in `vscodeTokens.ts` from `'rgba(255,255,255,0.55)'` to
   `'rgba(255,255,255,0.82)'`.

### Phase 2 — Rich output colorization

7. **Add `colorizeOutputLine(text: string): React.ReactNode`** as a module-level pure function.
   Rules applied in priority order:

   - Lines starting with `==>` → `==> ` in `VSCODE_COLORS.promptBranch` (amber), rest in
     `VSCODE_COLORS.syntaxFunction` (yellow) — matches `brew ls` section headers
   - Lines starting with `✓` → `✓` in `VSCODE_COLORS.promptDollar` (green), rest in
     `VSCODE_COLORS.foreground` — matches `npm run build` success
   - Lines matching `/^(v\d|\d+\.\d|julia version)/` → version token in `VSCODE_COLORS.syntaxVariable`
   - Lines matching `/^[0-9a-f]{7} /` — hash in `VSCODE_COLORS.lineNumber` (dim), rest in foreground
   - Default → plain `<>{text}</>` (inherits parent `Box` color)

   Apply to both the history output block and the active output block. The parent `Box` keeps
   `color: VSCODE_COLORS.outputText` so the default case stays at the right brightness.

### Phase 3 — Depth & animation polish

8. **Dim completed history rows**: wrap each `React.Fragment` in the `history.map` in a `Box` with
   `sx={{ opacity: 0.62, transition: 'opacity 0.15s' }}`.

9. **`clearing-screen` body flash**: add `opacity: phase === 'clearing-screen' ? 0.35 : 1` and
   `transition: 'opacity 0.12s ease-in'` to the terminal body `Box` `sx`.

### Phase 4 — Architecture cleanup

10. **Add `terminalBodyLines: 5` to `VSCODE_LAYOUT`** in `vscodeTokens.ts`. Replace
    `height: 'calc(8.5em + 16px)'` with a derived expression using the constant.

11. **Add `data-testid="terminal-panel-body"`** to the terminal body `Box`.

12. **Remove redundant `minWidth` override** on the outer wrapper `Box`; keep `width` and
    `maxWidth: '100%'`.

## Validation plan

1. `npm run build`
2. `CI=true npm test -- --watch=false --testPathPattern="TerminalHeroContent|Home"`
3. Visual check at `http://localhost:3100/`:
   - Panel header in mixed case with blue accent underline on "Terminal"
   - Prompt shows `○ ❯ ` (dim circle + green chevron)
   - Path reads `~/dev-danhenderson  v1 *1 +3`
   - History rows visually dimmer than active prompt
   - `brew ls`: `==> Formulae` / `==> Casks` in amber/yellow
   - `npm run build`: `✓` in green
   - `git log`: hash dimmed, message in foreground
   - Version outputs: light blue version tokens
   - Output is legibly bright; cursor is full block `█`

## Risks and rollback

- `colorizeOutputLine()` patterns must apply in priority order — the ordered `if/else` avoids
  double-matching.
- History `opacity` wrapper adds one DOM node per entry; no performance concern for ≤6 entries.
- If `terminalBodyLines` height clips the last line, adjust the constant value; no structural change.
- Rollback is a two-file revert; no cross-file coupling introduced.

## Progress notes

- Plan written from screenshot reference and code audit.

## Completion status

- [ ] Not started
- [ ] In progress
- [x] Complete
