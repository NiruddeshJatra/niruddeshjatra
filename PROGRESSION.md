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

## Phase E — Reading Experience Overhaul
**2026-05-08 — typography hierarchy, Bengali font, matrix opacity, terminal auto-collapse**

- **EssayContent.tsx** (`src/components/sections/`): new shared essay wrapper component. English h1 gets `tracking-[0.15em] uppercase`; Bengali h1 gets `tracking-[0.1em]` (no uppercase — Bangla has no case). Subtitle `text-foreground/45`, no `>` prefix marker. `lang="bn"` attribute set on root div when `currentLang === 'bn'`.
- **Bengali font** (`src/index.css`): Google Fonts import updated to include weight 500. `[lang="bn"]` rule overhauled: Noto Sans Bengali weight 500 (was 300), `letter-spacing: 0.02em`, `line-height: 1.9`. Added heading rule at weight 500 with `letter-spacing: 0.05em`. Departure Mono kept as fallback for Bangla to maintain visual mass consistency.
- **MatrixBackground opacity prop** (`src/components/MatrixBackground.tsx`): added `opacity?: number` prop. Canvas style uses `opacityProp ?? config.opacity` (default unchanged at 0.25). `Editor.tsx` passes `opacity={0.08}` when `currentSection?.startsWith('writing/')` — reduces rain to near-invisible on essay routes while preserving atmosphere.
- **Terminal auto-collapse** (`Terminal.tsx` + `ResponsiveLayout.tsx`): input row extracted from scrollable history div into its own `shrink-0` element between header and history — input always visible in collapsed state. Stats footer now gated on `isFocused` prop (hidden when collapsed). `ResponsiveLayout` owns `isTerminalFocused` state; computes height: reading pages 72px collapsed, other pages 132px collapsed, 288px expanded. Smooth `transition-all duration-200 ease-out`. Click-outside handler on `document.mousedown` uses `data-terminal-region` attribute. Escape key blurs terminal. No localStorage persistence — state is per page-load.
- **New section files** (previously untracked): `WritingContent.tsx`, `OnRunningForNothingContent.tsx`, `OnRunningForNothingBnContent.tsx`, `JourneyContent.tsx`, `RunningContent.tsx` — all committed alongside this phase.

---

## Phase D — Loader System (IntroLoader + PortalLoader)
**2026-05-03 — GSAP-powered intro and portal loaders with sessionStorage gating**

- **New files**: `src/components/IntroLoader.tsx`, `src/components/PortalLoader.tsx`, `src/hooks/useLoader.ts`, `src/lib/matrixChars.ts`
- **IntroLoader**: terminal typing animation (3 lines × 1.0s, 0.6s pauses, 0.7s hold, 1.0s fade-out = 5.9s). Fires once per browser session via `ncs_intro_seen` sessionStorage flag. Skip via Esc or click.
- **PortalLoader**: hand-rolled scramble reveal (3s, 40% pure cycling → 60% left-to-right lock-in, CYCLE_MS=120ms throttle) followed by phosphor-green cloud-veil dissolve (0.8s veil + 2s overlay fade). One portal per area per session, gated by `ncs_portal_seen_*` keys. Destinations: `> arczero standby`, `> entering the workshop`, `> entering the writing`, `> entering the journal`.
- **FOUC elimination**: both overlays render opaque by default (no initial `opacity:0`); Suspense fallbacks show `bg-background` while lazy chunks load — together these eliminate all flashes between page load and loader start. PortalLoader uses `useLayoutEffect` to pre-populate scrambled text before first paint.
- **matrixChars.ts**: extracted shared `KATAKANA`/`DIGITS`/`CHARS` arrays from `MatrixBackground.tsx` to avoid duplication. PortalLoader uses a different charset (extended unicode cipher set).
- **gsap** added to dependencies (free tier, v3.15). Uses `gsap.context()` + `ctx.revert()` pattern (no `@gsap/react`).

---

## Phase D2 — Welcome Redesign + Portal Intro Softening
**2026-05-04 — terminal-style welcome, day-stable quote rotation, portal loader eased in**

- **Welcome page** (`src/components/Editor.tsx` default branch): fully rewritten as left-aligned terminal output. Dropped `max-w-2xl mx-auto` wrapper — content flows left at editor width. Added four named sections: `// where to go` (5 react-router Links in `grid-cols-[auto_1fr]` two-column layout), `// in my head today` (day-stable rotating quote), `// the last few moves` (Changelog), `// fine print` (relocated help tip). Opener reduced from 6 lines to 3.
- **Quote rotation** (`src/lib/quotes.ts`): new file with 30 hardcoded `Quote { text, attribution?, lang? }` entries spanning personal aphorisms, song lyrics, and philosophy. `getTodaysQuote()` uses `year * 365 + dayOfYear` index — stable for a given calendar day, advances at midnight. Bangla entries carry `lang: "bn"` for future font-hook targeting. No state, no animation, computed once at render.
- **Changelog** (`src/constants/changelog.ts`, `Changelog.tsx`): data shape changed from `{ date, section, summary, target? }` to `{ hash, date, message }` — 10-entry git-log style timeline from 2001 to present. Rendered as CSS grid `grid-cols-[7ch_7ch_1fr]`; HEAD hash in `text-phosphor`, others in `text-phosphor-dim`. Border/card wrapper and nav links removed — pure terminal log output.
- **PortalLoader intro delay** (`src/components/PortalLoader.tsx`): text span starts invisible (`opacity: 0` inline). GSAP timeline adds `autoAlpha` 0→1 fade (0.35s) starting at t=0.3s; scramble phase shifted to t=0.5s (was t=0). Overlay stays opaque throughout — FOUC constraint unchanged. Total loader duration ~6.5s (+0.5s). Effect: ~0.5s of dark overlay before text appears, softening the abrupt scramble onset.
- **Typographic split locked**: welcome = terminal output (left-aligned, no max-width); prose pages = centered `max-w-2xl`. Conventions added to CLAUDE.md.

---

## Phase E2 — ArcZero Integration Fix + Custom 404
**2026-05-08 — SPA fallback rewrite, NotFoundContent, forceSection pattern**

- **vercel.json** (`vercel.json`): added SPA fallback rewrite `/(.*) → /index.html` after the existing ArcZero proxy rewrite. This fixes browser-back 404s on React Router routes after deep navigation. Order is load-bearing: ArcZero proxy must remain first (Vercel first-match-wins).
- **ArcZero proxy**: `base: './'` was already set in ArcZero's `vite.config.js` — built asset paths are relative (`./assets/…`), so ArcZero loads correctly when proxied under `niruddeshjatra.space/games/arczero/`. No ArcZero source changes needed.
- **NotFoundContent.tsx** (`src/components/sections/NotFoundContent.tsx`): new section component. Renders terminal-style `cat <path>` failure, `ls` with clickable top-level route links, and `cd ~` home link. File header in Editor shows `<pathname>.404`. Footer: `— nj · 404 · this file does not exist`. Lazy-loaded like all other sections.
- **404 routing** (`src/App.tsx`, `src/pages/Index.tsx`): React Router `*` catch-all now renders `<Index forceSection="404" />` instead of the old generic `NotFound` page. `Index` accepts optional `forceSection?: string` prop that overrides the URL-derived `currentSection`. `Editor.tsx` maps sentinel `"404"` to `<NotFoundContent />` and uses `useLocation()` to build the filename display.
- **Pattern introduced**: `forceSection` prop on `Index` — use this whenever a route needs to override URL-derived section mapping without touching the URL itself.

---

## Phase F — The Vault, ArcZero Routing Fix, and May Updates
**2026-05-10 — terminal secrets, Vercel routing edge cases, and lockfile cleanup**

- **Terminal Vault (`Terminal.tsx`)**: Added hidden `vault` command that navigates to `/vault`, locked behind a passphrase hint in the `secrets` output. Added `coffee` easter egg command. Sanitized `whoami --deep` to migrate sensitive personal history into the vault.
- **Vault Prose (`VaultContent.tsx`)**: Finalized personal prose in the vault replacing bracketed placeholders, detailing the CUET dropout, family financial dynamics, relationship context, and 5-10 year mountaineering/running goals.
- **May Content Update**: Updated `NowContent.tsx` with May 2026 status (tutoring dominance, training restructure). Added "Dhaka Run 25K" to the 2026 calendar in `RunningContent.tsx`. Updated `quotes.ts` with new aphorisms and song lyrics.
- **ArcZero Routing Fix (`vercel.json`)**: Fixed a subtle Vercel Edge Router bug where the trailing slash in `/games/arczero/` caused a rewrite mismatch and fell through to the portfolio's 404 page. Added an explicit rewrite rule for `"/games/arczero/"` (with slash) to proxy correctly. ArcZero's `base` was updated to `"/games/arczero/"` to ensure absolute path resolution immune to Vercel's slash-stripping.
- **Project Cleanup**: Updated `.gitignore` to ignore the entire `.claude/` directory and removed the redundant `bun.lockb` to standardize on `yarn.lock`.

---

## Phase G — Games Redesign + Field Notes Launch
**2026-05-11 — ArcZero card in ArcZero's design language; field-notes section shipped with 3 seed entries**

- **GamesContent.tsx** fully rewritten. ArcZero card now uses ArcZero's own design language: `#44aaff` title (Courier New, 2.5rem), dark wash background `rgba(10,10,15,0.92)`, cyan border `rgba(68,170,255,0.4)`, ghost PLAY button with hover fill `rgba(68,170,255,0.12)`. Deliberate guest design language — the card announces ArcZero's identity inside the portfolio site's phosphor-terminal register. File-signature footer removed (games page is not a document). Readme link removed (repo goes private at launch). Word-grid placeholder kept in quiet site register.
- **FieldNotesContent.tsx** created. New section at `/field-notes`. Pattern: `> prefix` frame paragraph, then `<article>` blocks newest-first (2026-05-08, 2026-05-05, 2026-05-01). Bangla quote in entry 3 uses `<blockquote lang="bn">` + English italic line below — matches the `[lang="bn"]` Noto Sans Bengali rule in `index.css`. No expand/collapse, no pagination, no tags. File-signature footer: `— nj · 3 notes · 2026-05 · more as they come`.
- **Editor.tsx**: added `FieldNotesContent` lazy import; `field-notes` switch case now routes to it (was `SoonContent`). Fixed `journey-hiking` fall-through that previously shared the `field-notes` case.
- **Pattern added to CLAUDE.md**: guest design language rule (ArcZero card) and field notes page convention.

---

## Phase G.1 — Writing Taxonomy Restructure + Portal Simplification
**2026-05-11 — nested writing/essays/ + writing/tech-articles/ subfolders; portal loaders stripped to ArcZero only**

- **FileExplorer.tsx**: writing section gained two nested container subfolders — `essays/` (id: `writing-essays`) and `tech-articles/` (id: `writing-tech-articles`). Added recursive `isFileVisible()` (full parent-chain visibility check) and `getDepth()` (0/1/2 → `pl-1`/`pl-4`/`pl-7` indent) to support arbitrarily nested sidebar items. Previous flat visibility check `!f.parent || expandedFolders.has(f.parent)` was depth-1 only.
- **Section IDs renamed**: essay sections changed from `writing/on-running-for-nothing` → `writing-essays-on-running-for-nothing` (and `-bn` variant). All references updated: `App.tsx` explicit routes, `StatusBar.tsx` path map, `WritingContent.tsx` links, `sections.ts` aliases, essay components' `alternateLangPath` props.
- **BlogContent.tsx + NotesContent.tsx deleted**: blog and notes sections removed from the site. Sidebar entries, terminal ls output, and portal loader keys cleaned up accordingly.
- **useLoader.ts**: portal loaders for `/games`, `/writing`, and `/blog` removed — only ArcZero portal (`ncs_portal_seen_arczero`) remains. Rationale: portals added friction with diminishing novelty; ArcZero's portal survives because it matches the game's own portal-entry aesthetic.
- **Terminal.tsx**: `ls` output updated (removed `writing/blog.md`, `writing/notes/`; now shows `writing/`). `help` text and `cd`/`cat` command sets updated to match new structure.
- **WritingContent.tsx**: opening lines updated; essay link paths updated to `/writing/essays/on-running-for-nothing`; `// tech articles` section added (placeholder).
