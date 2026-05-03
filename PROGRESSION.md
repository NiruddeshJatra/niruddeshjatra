# niruddeshjatra.space — Codebase Progression

Sequential history of every significant change to this site. Intended for future developers and AI agents needing context on *why* things are the way they are. Read top-to-bottom for full picture; skim headers for specific context.

---

## Origin — Lovable Scaffold
**commit `b8f0641`**

Project bootstrapped from the `vite_react_shadcn_ts` Lovable template. Baseline: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui components. No meaningful content yet — just the scaffold.

---

## Early Iterations — Generic Developer Portfolio
**commits `5858276` → `9889a31`**

Several rapid iterations building a conventional developer portfolio: layout adjustments, adding a matrix background animation, easter eggs in the terminal, stats dashboard, mobile responsiveness. Identity framing at this stage: generic "Full-Stack Developer / software engineer" positioning with résumé-style content.

Key additions:
- Matrix background (`MatrixBackground.tsx`) — canvas-based falling katakana/digit rain
- Interactive terminal with `help`, `whoami`, easter eggs
- Mobile responsive layout
- Theme switching (later removed)

---

## Theme Switcher Removed + Matrix Fix
**commit `6d5a6cb`**

Removed ThemeSwitcher component. Fixed matrix background to fill full height. Site locked to dark terminal aesthetic — no light mode.

---

## .claude/ Workspace Bootstrap
**commit `4c5fc44`**

Added `.claude/` directory with project rules (`frontend.md`, `portfolio.md`) and initial `CLAUDE.md` project brain. Established the Claude Code workflow for this repo.

---

## Phase 1 — Portfolio Hygiene + Matrix Fidelity
**commit `bbb771e`**

First structured upgrade phase. Cleaned up placeholder content, tightened matrix animation fidelity, initial polish pass.

---

## Phase 2 — Routing + Lazy Sections + /now Page
**commit `414b01c`**

- React Router routing introduced
- All sections converted to `React.lazy` with skeleton fallbacks
- `/now` page added (what I'm doing right now)
- `SECTION_ALIASES` constant in `src/constants/sections.ts` established as single source of truth for navigation

---

## Phase 3 — Reactive Matrix + /lab + Changelog
**commit `2da9da5`**

- Matrix background becomes reactive: responds to terminal `focus`, `type`, `blur` signals via `matrixSignals.ts`
- `/lab` section added with interactive experiments: `MatrixPlayground`, `TypingChallenge`
- Home welcome view gets a `<Changelog />` widget showing recent commits

---

## Phase 4 — View Transitions + /colophon + Bundle Budget
**commit `60425c0`**

- CSS View Transitions API wired for soft cross-fade between routes (Chromium 111+)
- `/colophon` page added
- Bundle size budget enforced in build pipeline

---

## Phase 5 — Mobile Shell + Command Palette + Notes Backlinks
**commit `99110eb`**

- `MobileShell.tsx` introduced: dedicated mobile layout gating at < 768px via `ResponsiveLayout`
- `CommandPalette.tsx`: Cmd+P (files) / Cmd+Shift+P (commands), lazy-loaded
- `NotesContent.tsx`: seed notes with backlink/related-notes logic
- `KeyboardShortcutsHelp.tsx`: floating help button for keyboard shortcuts

---

## Core IDE Architecture Solidified
**commit `e4a0193`**

Structural consolidation pass. `FileExplorer.tsx` established as authoritative `files` array. `Editor.tsx` as the VS Code-style content pane with per-section skeleton fallbacks. Line numbers, UTF-8/LF status bar details added to editor chrome.

---

## Phase A — Identity Purge (Rebuild as niruddeshjatra)
**commit `30dbb64`**

Major identity shift. Removed "Full-Stack Developer" framing entirely. Rebuilt around nj's actual identity: game maker, tutor, runner, writer. Key changes:
- `whoami` in terminal rewritten to nj's voice
- About content restructured around `const me = { ... }` object (code-as-self aesthetic)
- Generic résumé framing retired — archived sections (`archived/experience`, `archived/education`, etc.) replace the old me/ sections
- Seed notes in `NotesContent` reflect real thinking
- Status bar had resume link (`/resume.html`)
- `public/resume.html` existed as plain-text résumé

---

## ArcZero URL Fix
**commit `693fd5b`**

Updated `vercel.json` to correct the ArcZero game URL routing.

---

## Phase C1 — Phosphor-Terminal Theme Overhaul
**2026-05-02 — current working state (unstaged)**

Comprehensive visual register overhaul. Retired the "VSCode rainbow" color system in favour of a disciplined monochrome phosphor-terminal palette derived from the site's own dark-mode values.

### Design tokens
- New palette: near-black green-tinted background (`#0a0e0a`), phosphor-green accent (`#00d26a`), phosphor-soft foreground (`#e6ffe6`), phosphor-dim muted (`#9ab09a`), danger red (`#ff4444`)
- All values in HSL format for shadcn consumption
- Semantic Tailwind utilities added: `text-phosphor`, `text-phosphor-soft`, `text-phosphor-dim`, `text-danger`
- **All `terminal-{cyan,purple,yellow,orange,blue,green}` utility classes retired** — zero matches across editable files

### Typography
- **Departure Mono** installed as primary font (`public/fonts/DepartureMono-Regular.woff2/.woff`)
- JetBrains Mono demoted to fallback
- `fontFamily.mono` in `tailwind.config.ts` updated accordingly

### Editor chrome cleanup (`Editor.tsx`)
- Line numbers (1–100 loop) removed
- UTF-8/LF status in file header removed
- Per-section colored file icons unified to `text-phosphor-dim`
- 3 orphaned helper components removed (`ResponsiveCodeBlock`, `ResponsiveImage`, `ResponsiveTextContainer`)

### Section components
- `max-w-2xl` → `max-w-xl` on short-form sections (NowContent, ContactContent, GamesContent, ArchivedContent, SoonContent, LockedAbout)
- File-signature footer added: `— nj · YYYY-MM · N bytes` (hardcoded bytes per section)
- JSDoc comment-block headers: none found (already absent)

### Terminal (`Terminal.tsx`)
- All emoji output replaced with ASCII markers (`>`, `!`, `ok ·`, `•`)
- Color rendering conditions updated to use `text-phosphor`, `text-danger`
- Legacy emoji checks (☕ 🚀 🍕) removed from render logic

### StatusBar (`StatusBar.tsx`)
- Resume link (`/resume.html`) removed (file was already absent)
- `FileText` import dropped

### Notes → SoonContent
- `NotesContent.tsx` replaced with a thin `<SoonContent />` wrapper — seed notes killed

### Pending (Phase C2)
- 4 forbidden files still carry `terminal-*` classes: `FileExplorer.tsx`, `MobileShell.tsx`, `ResponsiveHeader.tsx`, `CommandPalette.tsx` — intentionally deferred

---

## Phase C2 Preview — UI Polish & Matrix Aurora
**2026-05-02**

Refined several UI details based on review:
- **Matrix Background**: Restructured drop generation into "aurora" wavefronts using overlapping sine waves for a consistent, choreographed downpour. Increased font size (`16`) and density (`0.6`). Removed unused fade constants.
- **Terminal**: Resolved a double-cursor issue by obscuring the native input caret and overlaying a custom green block cursor (`▋`).
- **Sidebar**: Renamed the root FileExplorer header from `NEXUS_CORE` (previously `niruddeshjatra`) to `WORKSPACE` for a more grounded feel.

---

## Phase C2 — Phosphor Theme Overhaul Complete
**2026-05-03 — migrated deferred layout chrome to phosphor token system**

- **Files changed**: `FileExplorer.tsx`, `MobileShell.tsx`, `ResponsiveHeader.tsx`, `CommandPalette.tsx` — the four surfaces intentionally deferred from C1
- **Retired classes removed**: `terminal-cyan`, `terminal-green`, `terminal-blue` — all replaced per the C1 replacement map (`terminal-green/cyan` → `text-phosphor`, `terminal-blue` → `text-phosphor/70`)
- **Zero structural changes**: only className strings touched, conditional logic preserved exactly (e.g. active-state ternaries in FileExplorer and MobileShell)
- **CLAUDE.md updated**: removed the "pending C2" caveat from the color system convention — `terminal-*` classes now fully retired across all of `src/`
- `grep src/` confirms zero remaining `terminal-{cyan,green,blue,purple,yellow,orange}` matches; build and typecheck clean

---

*Updated by `after-change` on each commit. Append new entries at the bottom — never rewrite history.*

---

## Phase D — Loader System (IntroLoader + PortalLoader)
**2026-05-03 — GSAP-powered intro and portal loaders with sessionStorage gating**

- **New files**: `src/components/IntroLoader.tsx`, `src/components/PortalLoader.tsx`, `src/hooks/useLoader.ts`, `src/lib/matrixChars.ts`
- **IntroLoader**: terminal typing animation (3 lines × 1.0s, 0.6s pauses, 0.7s hold, 1.0s fade-out = 5.9s). Fires once per browser session via `ncs_intro_seen` sessionStorage flag. Skip via Esc or click.
- **PortalLoader**: hand-rolled scramble reveal (3s, 40% pure cycling → 60% left-to-right lock-in, CYCLE_MS=120ms throttle) followed by phosphor-green cloud-veil dissolve (0.8s veil + 2s overlay fade). One portal per area per session, gated by `ncs_portal_seen_*` keys. Destinations: `> arczero standby`, `> entering the workshop`, `> entering the writing`, `> entering the journal`.
- **FOUC elimination**: both overlays render opaque by default (no initial `opacity:0`); Suspense fallbacks show `bg-background` while lazy chunks load — together these eliminate all flashes between page load and loader start. PortalLoader uses `useLayoutEffect` to pre-populate scrambled text before first paint.
- **matrixChars.ts**: extracted shared `KATAKANA`/`DIGITS`/`CHARS` arrays from `MatrixBackground.tsx` to avoid duplication. PortalLoader uses a different charset (extended unicode cipher set).
- **gsap** added to dependencies (free tier, v3.15). Uses `gsap.context()` + `ctx.revert()` pattern (no `@gsap/react`).
