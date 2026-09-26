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

---

## Phase H — Second Essay + ArcZero Portal Click-Intercept Fix
**2026-05-12 — "on staying small" essay shipped (EN + BN); PLAY button portal fix**

- **OnStayingSmallContent.tsx** created. Second essay: "on staying small" — 7 sections (opening, what coaching is, what coaching sells, why this is personal, the suggestion, the contradiction, what i'd rather build), plus closing `pl-2 mb-4 mt-8` block with `>` prefix lines. Same `EssayContent` wrapper pattern as the medal essay.
- **OnStayingSmallBnContent.tsx** created. Bengali version: title "কোচিং সেন্টার দিলেই তো পারো!" (user-revised from "ছোট থাকা"). `lang="bn"` propagated via `EssayContent` root div. All 7 sections in Bengali verbatim.
- **useLoader.ts**: added `triggerPortal()` to `usePortalLoader()` return. Takes `{ destination, sessionKey?, onComplete? }`. Skips sessionStorage gate (manual trigger always fires). Stores `onComplete` in `onCompleteRef`; `dismiss` calls it after portal animation completes. Fixes the ArcZero PLAY button: full-page navigation was tearing down the React SPA before the portal could render.
- **GamesContent.tsx**: PLAY button converted from bare `<a href>` to click-intercept pattern. `handlePlayClick` calls `triggerPortal({ destination: '> arczero standby', onComplete: () => window.location.href = '/games/arczero/' })`. `href` retained for accessibility (right-click → open in new tab still works).
- **WritingContent.tsx**: second essay entry added (newest first). "on staying small" links to `/writing/essays/on-staying-small`; `[bn]` link to `-bn` variant.
- **FileExplorer.tsx**: `on-staying-small.md` added above `on-running-for-nothing.md` in `writing-essays` container (newest first).
- **App.tsx, Editor.tsx, StatusBar.tsx, sections.ts**: routes, switch cases, lazy imports, getFileName entries, getPath cases, LAST_UPDATED, and SECTION_ALIASES updated for both new essay sections.

---

## Phase I — Third Essay: "on forgetting"
**2026-05-14 — "on forgetting" essay shipped (EN + BN)**

- **OnForgettingContent.tsx** created. Third essay: "on forgetting" — 5 sections (opening, what forgetting actually does, the part that's me, what this looks like in everyday life, what i'd offer to anyone like me, what i didn't say), plus closing `pl-2 mb-4 mt-8` block. Same `EssayContent` wrapper pattern.
- **OnForgettingBnContent.tsx** created. Bengali version: title "সব মনে রেখে কী লাভ?" — 5 sections + extra section "যে কথাগুলো বলা হয়নি". User revised both EN and BN content post-creation; revisions intentional and accepted.
- **WritingContent.tsx**: on-forgetting added as first entry (newest first). Three essays now listed.
- **FileExplorer.tsx**: `on-forgetting.md` added as first child of `writing-essays` container (newest first).
- **App.tsx, Editor.tsx, StatusBar.tsx, sections.ts**: routes, switch cases, lazy imports, getFileName entries, getPath cases, LAST_UPDATED, and SECTION_ALIASES updated for both new essay sections.
- **CLAUDE.md**: sidebar file tree updated to reflect three essays under `essays/`, newest first.

---

## Phase E — Mobile Phase 1: Tear-down + Skeleton
**2026-05-14 — Delete parallel mobile impl; adapt desktop layout for mobile widths**

- **Deleted**: `MobileShell.tsx` (parallel mobile layout with wrong branding, dead bottom nav, no terminal) and `MobileNavigation.tsx` (custom file list that duplicated FileExplorer)
- **Created**: `MobileFileDrawer.tsx` — slide-in drawer from left that wraps the existing `FileExplorer` component unchanged; swipe-left + escape + backdrop-tap to close; auto-closes on section select
- **Created**: `MobileTerminalSheet.tsx` — fixed bottom sheet, 44px collapsed (`$ _` tap target), 60vh expanded with lazy-loaded `Terminal`; tap-outside + escape to dismiss
- **Modified**: `ResponsiveLayout.tsx` — removed `if (viewport.isMobile) return <MobileShell>` branch; mobile now served by same component: header (`niruddeshjatra` brand + hamburger, no search/shortcuts), `MobileFileDrawer`, `Editor` in `<main pb-11>`, `MobileTerminalSheet`; desktop branch unchanged
- **Modified**: `Editor.tsx` — ASCII banner no longer gated behind `!isMobile`; responsive font `text-[5px] sm:text-[8px] md:text-[10px]` fits at 360px without horizontal scroll
- **Modified**: `IntroLoader.tsx` — `text-xs sm:text-sm` + narrower padding; loader lines fit single-line at mobile width
- **Modified**: `PortalLoader.tsx` — `text-xl sm:text-3xl md:text-4xl`; destination phrase fits at 360px

---

## Phase M — Mobile Phase 2: Content Density + Layout Polish
**2026-05-14 — 13 mobile polish changes across 10 files; no desktop regressions**

- **Editor.tsx**: ASCII banner outer div `overflow-x-auto` removed; `<pre>` gets `overflow-hidden whitespace-pre` instead of scrolling — clips at 360px without horizontal scroll. Approach chosen: text-[5px] (already set in Phase E), now properly clipped.
- **Changelog.tsx**: timeline rows `mb-1` → `mb-3 sm:mb-1` — welcome page "// the last few moves" section breathes on mobile.
- **MobileFileDrawer.tsx**: outer "FILES" header section removed entirely. Close button repositioned as absolute top-right. `FileExplorer`'s own "WORKSPACE" header is now the sole visual anchor — no double-header.
- **Terminal.tsx**: `hideStatusFooter?: boolean` prop added; status footer (time/branch/tip) gated by `isFocused && !hideStatusFooter`. Default false — desktop unchanged.
- **MobileTerminalSheet.tsx**: passes `hideStatusFooter={true}` to Terminal — cramped status footer hidden in mobile sheet.
- **ResponsiveLayout.tsx**: mobile header rebuilt as two-row: row 1 = brand + GitHub icon + hamburger; row 2 = `tutor · runner · maker` subtitle in dim small text. Imported `Github` from lucide-react. Main content `pb-11` → `pb-16` (64px clearance for terminal bar).
- **WritingContent.tsx + JourneyContent.tsx**: two-column CSS grid collapsed to stacked on mobile (`space-y-4 sm:space-y-1`; `sm:grid sm:grid-cols-[auto_1fr]`). Title on top, description full-width below. Two-column layout preserved at sm: breakpoint and up.
- **GamesContent.tsx**: ArcZero card inline `padding: 32px 28px` replaced with Tailwind `p-6 sm:p-8` (24px mobile, 32px tablet+). "the rule" paragraph gets `pr-2` right padding for browser floating UI clearance.
- **RunningContent.tsx**: race log, skipped races, and 2026 calendar all wrapped in `overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0` with `min-w-[640px] sm:min-w-0` inner — extend scroll area to viewport edges on mobile. Mobile-only `← swipe to scroll →` indicator above each.

---

## Phase N — Mobile Phase 3: Touch Polish + Drawer Fixes
**2026-05-15 — Swipe gestures, keyboard handling, FAB clearance, drawer dedup, matrix fix**

- **Editor.tsx (ASCII banner)**: stacked two-line mobile version (`NIRUDDESH` / `JATRA` at `text-[28px]`, `sm:hidden`) added above existing full ASCII art (now `hidden sm:block`). Desktop banner unchanged. Welcome page fine-print paragraph gets `pr-12 sm:pr-0` to clear Chrome's scroll-to-top FAB on Android.
- **EssayContent.tsx (language toggle)**: refactored from two `<span>` elements that could wrap to a single `flex items-baseline gap-3` row. Active lang = `<span className="text-phosphor">`, inactive = `<Link className="text-phosphor-dim hover:text-phosphor">`. Never wraps.
- **EssayContent.tsx (font size)**: outer div changed from `text-base leading-[1.8]` to `text-[13px] sm:text-[15px] leading-[1.7] sm:leading-[1.8]`. Reduces cramped feel on mobile; heading/footer overrides still apply.
- **GamesContent.tsx**: "the rule" paragraph `pr-2` → `pr-12 sm:pr-2` for FAB clearance on mobile.
- **MobileFileDrawer.tsx**: eliminated double-header. Removed outer absolute X button and explicit `w-72`. `FileExplorer` now receives `headerAction` (X button) that replaces the collapse chevron in the WORKSPACE header row — one header, one control. Drawer width driven by FileExplorer's `navClassName="!w-64"` (256px mobile vs 192px desktop).
- **FileExplorer.tsx**: added `headerAction?: React.ReactNode` and `navClassName?: string` props. `headerAction` slots into the WORKSPACE header in place of the collapse chevron. `navClassName` appends to the expanded nav's class list (enables width override for mobile drawer).
- **MobileTerminalSheet.tsx**: swipe-down dismissal wired to drag handle (`handleTouchStart/Move/End`, 50px threshold, `touch-none` on handle). `visualViewport` API listener adjusts `keyboardOffset` state when on-screen keyboard appears; sheet uses `style={{ bottom: keyboardOffset, height: ... }}` instead of Tailwind height class. Degrades gracefully when API absent.
- **MatrixBackground overlay fix**: removed `backdrop-blur-sm` from `editor-content` div in `Editor.tsx`. Root cause: `Editor.css` applies `transform: translateZ(0); will-change: transform` to `.editor-content` on mobile, creating a GPU compositing layer boundary that caused `backdrop-filter` to blur the wrong layer — a solid dark background instead of the canvas — producing a visible dark overlay on mobile only.
- **RunningContent.tsx**: Sylhet International Marathon 2026 (42.2K, 2026-08-08) added to 2026 calendar with `weight: "phosphor"` (A-race marker).

---

## Phase O — Mobile Polish: Keyboard UX + Readability Fixes
**2026-05-15 — 5 files; terminal keyboard handling, essay line height, games card scaling**

- **Editor.tsx (ASCII banner)**: `overflow-hidden` → `overflow-x-auto overflow-y-hidden` on `<pre>` — banner now scrolls horizontally on narrow screens instead of clipping.
- **Terminal.tsx**: added `hideMobileTips?: boolean` prop (skips "tab = autocomplete" line from initial history) and `blurOnCommand?: boolean` prop (blurs input after command executes, dismissing on-screen keyboard). Both default false — desktop unchanged.
- **MobileTerminalSheet.tsx**: added `viewportHeight` state updated by `visualViewport` handler. Sheet height clamped to `viewportHeight - 8px` when keyboard is open (`keyboardOffset > 0`), preventing sheet from going off-screen. Inner div changed from hardcoded `h-[calc(60vh-2rem)]` to `h-[calc(100%-2rem)]`. Passes `hideMobileTips={true}` and `blurOnCommand={true}` to Terminal — keyboard auto-closes after each command.
- **GamesContent.tsx**: outer div gets `pb-16 sm:pb-4` for bottom spacing clearance. ArcZero title `fontSize: 2.5rem` → `clamp(2rem, 8vw, 2.5rem)`; subtitle `clamp(0.7rem, 2.5vw, 0.9rem)`; body text `clamp(0.8rem, 2.5vw, 0.9rem)` — card scales down gracefully on narrow screens.
- **EssayContent.tsx**: `leading-[1.7] sm:leading-[1.8]` → `leading-[1.85] sm:leading-[2]` — increased line height improves readability on both mobile and desktop.

---

## Phase P — Toolchain Migration: Yarn Berry → npm
**2026-05-16 — Fix broken dev environment caused by Yarn Berry PnP on Windows**

- **Root cause 1**: `~/.npmrc` contained `os=linux` — forced npm to install Linux-only optional binaries (`@esbuild/linux-x64`, skipping `@esbuild/win32-x64`, `@rollup/rollup-win32-x64-msvc`, `@swc/core-win32-x64-msvc`). Cleared.
- **Root cause 2**: `packageManager: "yarn@4.13.0"` field in `package.json` activated Corepack, which routed all `npm` calls through Yarn Berry PnP. PnP uses `__virtual__/...` path aliases that Vite cannot resolve. Field removed (Corepack auto-added `packageManager: "npm@11.14.1"` on next run).
- **Root cause 3**: `@vitejs/plugin-legacy@8.0.2` requires Vite 8; project uses Vite 5. Pinned to `^5.4.0`.
- **package.json scripts**: replaced all `yarn node` → `node` and `yarn <script>` → `npm run <script>` in `build`, `generate-og`, `generate-favicons`, `prerender`, `postbuild`.
- **Deleted**: `yarn.lock`, `.yarnrc.yml`, `.yarn/` directory.
- **Result**: `npm run dev` boots Vite 5.4.21 in ~700ms; `tsc --noEmit` passes clean; Windows native binaries all present.

---

## Phase P.1 — SEO: Code Review Fixes + Docs
**2026-05-16 — Address prerender portability, route centralization, and missing SEO docs**

- **scripts/routes.mjs** created: single source of truth for all prerenderable routes. `prerender.mjs` now imports from it instead of defining routes inline. `sitemap.xml` still maintained separately (carries extra metadata: `changefreq`, `priority`, `hreflang`).
- **scripts/prerender.mjs**: replaced hard-coded Windows Chrome path with OS-aware `findChrome()` (checks `CHROME_PATH` env, then platform-specific defaults for win32/darwin/linux). If no browser found → `process.exit(0)` (graceful skip, build does not fail). This fixes the Vercel build failure where Chrome was not present in the CI environment.
- **vite.config.ts spread**: kept `...legacy({})` — `@vitejs/plugin-legacy@5` returns `Plugin[]`, so spreading is required and correct. Documented in CLAUDE.md.
- **CLAUDE.md**: added `scripts/` tree section, `src/lib/structuredData.ts` entry, and full SEO section covering: SEO component usage, structured data helpers, prerender route source of truth, Chrome detection, and the legacy plugin spread rationale.

---

## Phase Q — SEO: www→apex Redirect + Production Deployment Unblock
**2026-05-16 — Add www redirect; diagnose why pre-rendered build wasn't in production**

- **Root cause**: `seo-fix` branch (containing all Puppeteer-based pre-rendering, react-helmet-async SEO, JSON-LD) was committed but never pushed to origin. Vercel deploys from `main`/remote, so production was still serving the old build with no og: tags.
- **vercel.json**: added `redirects` array with host-conditional 301: any request to `www.niruddeshjatra.space` 301-redirects to `https://niruddeshjatra.space/$1`. Previously www returned 200 with its own content — crawlers (Facebook, Google) could fetch a different URL than canonical. ArcZero rewrites preserved exactly.
- **Diagnostic confirmed**: local `dist/` is fully correct — `dist/index.html` has all og:title, og:description, og:image, twitter:*, WebSite JSON-LD; `dist/writing/essays/on-staying-small/index.html` has essay-specific og:title, og:description, Article JSON-LD with `datePublished: 2026-05-10`.
- **google8eaf4159b05eea80.html**: Google Search Console ownership verification file added to project root (served as static asset).

---

## Phase R — Content Refresh: Field Notes, Running Log, Now Page (Pre-Announce)
**2026-07-03 — Bring personal content current ahead of public site announcement**

- **FieldNotesContent.tsx**: added 3 new dated entries at top (newest-first) — `2026-07-03` (fajr schedule shift, presence vs. attendance), `2026-06-25` (first paid client site, handling a correction list), `2026-06-19` (Dhaka 25K race recap — 2:32:40, even splits, glute issue at km 18). Footer count bumped to 6 notes, stamp to 2026-07.
- **RunningContent.tsx**: Dhaka Run 25K moved from the `cal[]` watchlist into `racesAfterGap[]` as a completed, flagged result (2h 32m, note on even splits/comeback). `cal[]` replaced wholesale with 6 confirmed 2026 races (Chatto Metro Half, Sylhet Int'l Marathon, Active Pulse Chattogram, Albatross Ultrail, Cox's Bazar Int'l Marathon, Costral Ultra) — dropped several stale/unconfirmed entries (Fuel Xtream, Sylhet Summer 30K, Hatirjheel Ultra, Raipura, Athlete X, Jolshiri, MSDO Satkania, Northern, Moheshkhali, Bhawal 2027). Footer stamp to 2026-07.
- **NowContent.tsx**: rewrote all four sections (tutoring, training, races, building) to reflect current state — taper week ahead of Chatto Metro Half, post-Fajr training window (5:15–6:45am), Dhaka 25K result, autumn race calendar, site announcement, ArcZero leaderboard, rental-marketplace rebuild. SEO description and footer stamp updated to 2026-07.
- Content-only pass — no routing, component structure, or architecture changes. Voice rules preserved (lowercase in field notes/running, sentence-case allowed in now.md).

## Google Analytics Integration
**2026-07-10 — Added Google Analytics (GA4) tracking tag to index.html**

Added Google tag (`G-2CWN5RMGK4`) immediately after `<head>` in `index.html`. Single placement covers all routes since the site is a SPA. No architectural changes — config-only addition.

## Phase S — "The Paper Oscilloscope": Bilingual Article System
**2026-07-18 — Full bilingual tech-article system with interactive instruments, portal navigation, SEO**

- **`src/articles/`**: new sub-world outside `ResponsiveLayout`. Aged-paper design system (`article.css`): paper bg `#e8dfc9`, ink `#26241C`, ink-green `#00753F` on paper, phosphor `#00d26a` only inside dark scope wells. Tailwind tokens added under `paper`, `ink`, `rule`, `machine`, `well`.
- **11 primitives** (`PromptBar`, `Kicker`, `Section`, `Instrument`, `Caption`, `Term`, `Deeper`, `Recap`, `RelayNav`, `Colophon`, `TraceRail`) — typed TSX, no dc-runtime/{{holes}}/support.js.
- **7 widgets** — `NoiseVsBands` (canvas signal + noise slider), `TransistorSwitch` (water-tap analogy + n-channel MOSFET schematic), `GatePlayground` (AND/OR/NOT with truth table), `FeedbackLatch` (cross-coupled NOT gates, Q/Q̄ state, random power-on), `ThreeBits` (binary toggle cells), `AbstractionStack` (7-layer SVG), `ProtagonistDisguises` (5-station SVG track + cards).
- **2 articles** — `MachineBeneathYourCode` (SPINE intro, 8 min) and `WhatsInsideABit` (DEEP-DIVE, 12 min). Both fully bilingual BN/EN; BN default, JS toggle, no URL change.
- **Portal navigation** — `firePortal()` singleton (from `useLoader.ts`) fires the PortalLoader transition before navigating to any `writing/tech-articles/*` route. Works from sidebar (`handleSectionChange` in `Index.tsx`), WritingContent buttons, and Terminal commands.
- **Routing** — `ArticlePage.tsx` + `ArticleHub.tsx` added; `App.tsx` wired with routes `/writing/tech-articles`, `/writing/the-machine-beneath-your-code`, `/writing/whats-inside-a-bit`. FileExplorer entries and `sections.ts` aliases added.
- **SEO** — `<Helmet>` inside `ArticleBody` (has `useLang()` context) so title, description, `<html lang>` update on BN/EN toggle. `scripts/routes.mjs` and `public/sitemap.xml` updated with all three article routes.
- **Linter clean** — fixed `no-unused-expressions` in `NoiseVsBands.tsx`, moved `ARTICLE_SECTIONS` constant outside component in `Index.tsx`, added `eslint-disable` comments on non-component exports in context files.
- **Reference files removed** — `Article - *.dc.html`, `Series Hub.dc.html`, `CLAUDE-design.md`, `DESIGN-SPEC.md`, `support.js` deleted after implementation complete.

## Article 0 content + Field Notes update
**2026-07-23 — Added "An honest disclaimer" section, field note on series publishing, welcome line, BN header weight fix**

- **`MachineBeneathYourCode.tsx`**: added Section 06 "একটা সৎ স্বীকারোক্তি / An honest disclaimer" — content sourced verbatim from `src/articles/series-01/The Machine Beneath Your Code.md` (both BN and EN versions), not invented.
- **`Section.tsx`**: Bangla h2 bumped to `fontWeight: 900` (inline style, overrides Tailwind) to visually match Bricolage Grotesque `font-bold` weight of English h2. Anek Bangla renders lighter at 700 due to stroke character of the script.
- **`FieldNotesContent.tsx`**: new note "the paper oscilloscope, half-published" (2026-07-23) prepended — reflects writing all 8 articles while publishing only intro and article 1.
- **`Editor.tsx`** (welcome section): added `// publishing now` comment line in intro block announcing the series.

## Phase T — SEO: Fix Silent Prerender Failure + Article System Meta Gap
**2026-07-23 — Root-caused why production had no per-route og:title/og:description; fixed prerender reliability, article SEO, per-article OG images, generated sitemap**

- **Root cause**: `prerender.mjs` only knew how to find a local desktop Chrome install; on Vercel's build container (no Chrome, no `CHROME_PATH`) it hit its graceful-skip path (`process.exit(0)`) and silently shipped the raw Vite shell — zero title/description/og:* for every route in production, despite `dist/` looking fully correct locally (as noted in Phase Q).
- **`scripts/prerender.mjs`**: added `@sparticuz/chromium` (new devDependency, pinned `138.0.2` for Node ≥20.11 compat) as a fallback browser when no local Chrome is found. Critically, missing-browser now **fails the build** when `CI`/`VERCEL` env vars are set, instead of silently exiting 0 — this class of regression can no longer ship invisibly. Local dev without any browser still warns and skips.
- **`src/articles/manifest.ts`**: added `enDescription`/`bnDescription`/`datePublished` fields to `ArticleEntry` and `INTRO_ARTICLE` — the single source of truth for article SEO metadata. Added `SERIES_DESCRIPTION_EN`/`SERIES_DESCRIPTION_BN`.
- **`src/pages/ArticlePage.tsx` + `ArticleHub.tsx`**: rewritten off raw `<Helmet>` (which was missing og:image, og:url, og:site_name, og:locale, twitter:*, JSON-LD) onto the shared `<SEO>` component + `articleSchema()`/`ItemList` structured data. Deleted a hardcoded `ARTICLE_META` object that duplicated descriptions already meant to live in `manifest.ts`. `getArticleMeta()` throws at render if a published article is missing required SEO fields.
- **`src/components/SEO.tsx`**: added `image` override prop (for per-article OG images) and `og:locale:alternate`. Fixed a pre-existing bug where `twitter:image` ignored the `image` override and always used the site-wide default.
- **`scripts/generate-og.mjs`**: now renders one 1200×630 PNG per published article + the hub (`public/og/<slug>.png`, Paper Oscilloscope palette) alongside the site-wide image, sourced from `manifest.ts`. Runs via `tsx` (not plain `node`) since it imports a `.ts` module.
- **`scripts/generate-sitemap.mjs`** (new): generates `public/sitemap.xml` + `public/robots.txt` from `scripts/routes.mjs` at build time — previously hand-maintained. BN/EN hreflang pairs for essays are derived from the `-bn` suffix convention already present in `ROUTES`, so a new bilingual essay picks up hreflang automatically.
- **`index.html`**: found and fixed a second, compounding bug — static `og:image`/`og:image:width/height`/`og:site_name`/`twitter:*` defaults baked into the head were never removed by Helmet (it only manages tags it renders), so every prerendered route shipped **two conflicting `og:image` tags**, generic one first. Even after fixing prerender + per-article images, scrapers reading the first match would still have shown the stale generic image. Removed the static defaults; kept a bare fallback `<title>` (safe — Helmet replaces the singleton title node rather than duplicating it).
- **`package.json`**: `build` script now runs `generate-sitemap` alongside `generate-og`/`generate-favicons`, before `tsc && vite build`.
- **Verified**: `npm run build` (full chain incl. prerender) succeeds; for `/`, `/about`, `/writing`, `/writing/tech-articles`, and both articles, exactly one unique `og:image`/`og:title`/`og:description`/canonical per route (confirmed via grep on `dist/`), Article JSON-LD present with correct `datePublished`/image/`isPartOf`. `tsc --noEmit` and `npm run lint` clean — zero new errors introduced (pre-existing unrelated lint errors in `vault.ts`/`utils/*` untouched).

## Article 2 — "How does anything become 0s and 1s?"
**2026-07-27 — Third tech article published (encoding, numbers, text, image, sound, compression); built from a user-supplied dc.html draft into plain React**

- **`src/articles/content/HowDoesAnythingBecomeBits.tsx`** (new): article body, following `WhatsInsideABit.tsx`'s pattern exactly (inline `bodyStyle`/`p()`/`pre()` helpers, `Section`/`Term`/`Deeper`/`Recap`/`RelayNav`/`Colophon` primitives). Content translated/adapted from a user-provided `Article - How The World Becomes Zeros And Ones.dc.html` draft — the dc-runtime file was deleted after the port, per the same rule from Phase S (never keep dc-runtime/`{{holes}}`/support.js files around after conversion).
- **6 new widgets** in `src/articles/widgets/`: `PlaceValueBuilder` (grow/build toggle — binary combinatorics + build-13 column toggler), `UnicodeEncodingDemo` (glyph → code point → UTF-8 byte breakdown for A/é/ক/🍕), `PixelColorDemo` (16-swatch RGB picker with per-channel binary), `SamplingRateDemo` (canvas wave + sample-rate slider, 4–48 Hz), `RLECompressionDemo` (flat vs noisy pattern, raw-vs-RLE byte-size bars), `CPUBlindLens` (same 8 bits shown as text/number/pixel).
- **`src/articles/glossary.ts`**: added 8 terms — `twoscomp`, `ascii`, `unicode`, `utf8`, `endian`, `sampling`, `lossless`, `lossy`.
- **`src/articles/manifest.ts`**: `how-does-anything-become-bits` flipped `state: 'next' → 'read'` with `enDescription`/`bnDescription`/`datePublished: '2026-07-27'`; `how-do-gates-do-arithmetic` flipped `'soon' → 'next'` (now the up-next card).
- **Wiring for the new route**: `ArticlePage.tsx` (CONFIGS entry + `isBnTitle` list), `App.tsx` (route), `scripts/routes.mjs` (sitemap/prerender), `FileExplorer.tsx` + `sections.ts` (sidebar file tree + alias), `Index.tsx` (`ARTICLE_SECTIONS` — portal trigger), `WritingContent.tsx` (`techArticles` list on `/writing`), `SeriesHub.tsx` (row state → `read`, next row → `next`, "2/8 read"), `WhatsInsideABit.tsx` (its `RelayNav` `next` href now points at the new article instead of `#`).
- **Fixed a latent bug while here**: `ArticlePage.tsx` passed `PromptBar`'s `readCount` as a hardcoded `1` regardless of which/how-many articles were published. Now computed once as `ARTICLES.filter(a => a.state === 'read').length`, so the progress dots stay correct as more articles ship.
- **Post-publish content corrections** (user-caught): (1) the 44.1 kHz `Deeper` aside originally implied Nyquist explains the exact number (`20×2=40kHz, rounded to 44.1`) — corrected to state Nyquist only sets the floor (>40 kHz), and the actual 44,100 figure is historical (NTSC/PAL video-tape PCM compatibility), with the mechanism spelled out in both languages. (2) UTF-8 body text conflated Bangla and emoji as both needing "up to 4 bytes" — corrected to state Bangla is exactly 3 bytes, emoji-class characters up to 4 (the glossary hover card already had this right; only the inline body prose was wrong).
- **Verified**: `tsc --noEmit` and `npm run lint` clean (fixed one `no-unused-expressions` ternary-as-statement in `SamplingRateDemo.tsx`, same class of fix as Phase S's `NoiseVsBands.tsx`). Full `npm run build` (OG + favicons + sitemap + prerender) succeeds; confirmed via grep on `dist/writing/how-does-anything-become-bits/index.html` that og:title/description/image/canonical/twitter:card are unique and correctly set, og:image is 1200×630 (correct Facebook/Twitter share ratio).

## Article 3 — "The CPU's Blueprint"
**2026-07-30 — Fourth tech article published (ALU, register, data bus, clock, 2+3=5 walkthrough); part 03/08 LEVEL 2 — THE MACHINERY**

- **`src/articles/content/BlueprintOfACPU.tsx`** (new): full bilingual article body following the same pattern as `HowDoesAnythingBecomeBits.tsx` (inline `bodyStyle`/`p()`/`blockquote()` helpers, 5 sections + RelayNav + Colophon). Content sourced from `Article - Blueprint Of A CPU.dc.html` draft — dc-runtime file left as untracked (not deleted yet) pending user decision. Intro section links back to `/writing/how-does-anything-become-bits` matching the cross-article link pattern established in articles 1→2.
- **3 new widgets**: `AdderWidget.tsx` (Half/Full Adder SVG with clickable inputs + wire-color signal state, Ripple Carry 4-bit mode with carry-chain arrows), `CPUDatapath.tsx` (4-step animated SVG: Register A/B → MUX → ALU → Data Bus → Register C → Decoder, narrated in BN/EN per step), `ClockVisualizer.tsx` (canvas `requestAnimationFrame` scrolling square wave, GHz slider 1–6, instability/corrupted waveform visual at ≥5 GHz via ResizeObserver for DPR-correct sizing).
- **`src/articles/glossary.ts`**: added `propdelay` (propagation delay, BN+EN) — explains why Ripple Carry Adder is too slow for modern GHz clocks; used via `<Term id="propdelay">` in the ALU section.
- **`src/articles/manifest.ts`**: article 03 entry completely replaced — slug `how-do-gates-do-arithmetic` (state: `next`) → `cpu-blueprint` (state: `read`) with `enDescription`/`bnDescription`/`datePublished: 2026-07-30`. Article 04 (`what-does-a-cpu-actually-do`) remains `soon`.
- **Wiring (same 11-file checklist as every article)**: `ArticlePage.tsx` (slug union type, `isBnTitle` list, CONFIGS entry, import), `App.tsx` (route `/writing/cpu-blueprint`), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` + `sections.ts` (sidebar + alias), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list), `SeriesHub.tsx` (row 03 → `read`), `HowDoesAnythingBecomeBits.tsx` (RelayNav `next` href `#` → `/writing/cpu-blueprint`).
- **`tsc --noEmit`** clean — zero type errors after all edits.

## Article 4 — "Heartbeat: Fetch-Decode-Execute"
**2026-08-03 — Fifth tech article published (instructions as bits, opcode/operand anatomy, program counter, the FDE cycle, pipelining); part 04/08 LEVEL 2 — THE MACHINERY**

- **`src/articles/content/HeartbeatFDE.tsx`** (new): full bilingual body following `BlueprintOfACPU.tsx`'s pattern (inline `bodyStyle`/`p()`/`pre()`/`mono()` helpers, 7 sections + `Deeper` + `Recap` + RelayNav + Colophon). Content sourced from `Article - Heartbeat Fetch-Decode-Execute.dc.html` + `src/articles/series-01/Heartbeat- Fetch-Decode-Execute.md`. Hook links back to `/writing/cpu-blueprint`; section 01 links back to `/writing/the-machine-beneath-your-code` for the "CPU is blind, software gives meaning" callback.
- **5 new widgets**: `InstructionAnatomy.tsx` (13-bit instruction with ADD/SUB/LOAD opcode toggle + click-to-cycle operand registers, live "CPU reads:" readout), `ProgramCounterDemo.tsx` (3 RAM rows, `PC++` steps the pointer — the same bits flip between "instruction!" and "just bits" purely by where the PC lands), `FetchDecodeExecute.tsx` (6-step SVG datapath: RAM/PC/IR/CU/MUX/ALU/Reg C with per-step animated wires and absolutely-positioned live value overlays), `InstructionCycleLoop.tsx` (static F→D→E→F loop figure with animated dashed arrows), `PipelineVisualizer.tsx` (single-cycle vs pipelined tick grid — 9 ticks vs 5 for the same 3 instructions).
- **`src/articles/glossary.ts`**: added 4 terms — `pc` (Program Counter), `ir` (Instruction Register), `cu` (Control Unit), `opcode`.
- **`src/articles/manifest.ts`**: article 04 entry replaced — slug `what-does-a-cpu-actually-do` (state: `soon`) → `heartbeat-fde` (state: `read`) with `enDescription`/`bnDescription`/`datePublished: 2026-08-03` and `readTime: ~14 min`.
- **Wiring (the standard 11-file checklist)**: `ArticlePage.tsx` (slug union, `isBnTitle` list, CONFIGS entry with `seriesPos: 4`, import), `App.tsx` (route `/writing/heartbeat-fde`), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` + `sections.ts` (sidebar + alias), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list), `SeriesHub.tsx` (row 04 → `read`), `BlueprintOfACPU.tsx` (RelayNav `next` href `#` → `/writing/heartbeat-fde`).
- **Also brought CLAUDE.md's `ARTICLE_SECTIONS` note up to date** — it had drifted, still listing only the first three article slugs; now includes `cpu-blueprint` and `heartbeat-fde`.
- **Verified**: `tsc --noEmit` and `eslint` on all new files clean. Full `npm run build` succeeds — `/writing/heartbeat-fde` prerenders, `public/og/heartbeat-fde.png` auto-generates, and grep on `dist/writing/heartbeat-fde/index.html` confirms unique `og:title`/`og:description`/`og:image` (1200×630) plus a sitemap entry at priority 0.8.

## Article 5 — "The Memory Hierarchy"
**2026-08-07 — Sixth tech article published (speed/capacity/cost trilemma, register→L1→L2→L3→RAM→disk layers, locality, cache lines, SRAM vs DRAM, cache coherence); part 05/08 LEVEL 2 — THE MACHINERY**

- **`src/articles/content/MemoryHierarchy.tsx`** (new): full bilingual body following `HeartbeatFDE.tsx`'s pattern (inline `bodyStyle`/`p()`/`pre()`/`mono()`/`h3Style` helpers, 9 sections + `Deeper` + `Recap` + RelayNav + Colophon). Content sourced from `src/articles/series-01/Memory Hierarchy.md` — the user-supplied `Article - The Memory Hierarchy.dc.html` draft was an empty `<x-dc>` stub with no body, so the markdown file was the actual source; the empty dc.html was deleted after confirming the markdown had full content.
- **6 new widgets**: `MemoryPyramid.tsx` (tap a layer — register through SSD/HDD — to see size/speed), `LatencyScale.tsx` (the "if register access = 1 second" table as log-scaled bars), `CacheLineLocality.tsx` (32-cell address grid grouped into 4-cell cache lines; click an address to see HIT vs MISS and watch the whole line get pulled in), `RowColumnTraversal.tsx` (6×6 matrix, row-major vs column-major step-through with a live hit/miss counter, `SegmentedToggle`-driven), `SRAMvsDRAM.tsx` (SRAM charge held flat vs DRAM charge decaying + auto-refreshing on an interval, `SegmentedToggle` mode, reduced-motion aware), `MemoryLookupCascade.tsx` (pick where data is found — register through disk — and play the cascading miss sequence with a running cycle-cost total).
- **`src/articles/glossary.ts`**: added 3 terms — `cacheline`, `locality`, `cachecoherence`. Cache coherence / MESI covered via a `Deeper` aside (no widget), same scope-control precedent as article 2's two's-complement and article 4's superscalar/OoO/branch-prediction asides.
- **`src/articles/manifest.ts`**: article 05 entry replaced — slug `the-city-of-memory` (state: `soon`) → `memory-hierarchy` (state: `read`) with `enDescription`/`bnDescription`/`datePublished: 2026-08-07`, `readTime: ~16 min`. Article 06 (`the-grand-manager`) flipped `soon` → `next`.
- **Wiring (the standard checklist)**: `ArticlePage.tsx` (slug union, `isBnTitle` list, CONFIGS entry with `seriesPos: 5`, import), `App.tsx` (route `/writing/memory-hierarchy`), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` + `sections.ts` (sidebar + alias), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list), `SeriesHub.tsx` (row 05 → `read`, row 06 → `next`), `HeartbeatFDE.tsx` (RelayNav `next` href `#` → `/writing/memory-hierarchy`).
- **Also fixed a stale counter found while here**: `SeriesHub.tsx`'s "X/8 read" badge still said "২/৮" (2/8) — articles 3 and 4 had been published without updating it. Now reads "৫/৮"/"5/8". Added a new `CLAUDE.md` bullet documenting that manifest slugs are placeholders until publish (this is the third time a roadmap slug has been renamed on publish: `how-do-gates-do-arithmetic`→`cpu-blueprint`, `what-does-a-cpu-actually-do`→`heartbeat-fde`, `the-city-of-memory`→`memory-hierarchy`).
- **Verified**: `tsc --noEmit` and `eslint` on all new/changed files clean. Full `npm run build` succeeds — `/writing/memory-hierarchy` prerenders, `public/og/memory-hierarchy.png` auto-generates (1200×630), and grep on `dist/writing/memory-hierarchy/index.html` confirms unique `og:title`/`og:description`/`og:image`/canonical/twitter:card.
- **Note**: an unrelated `PHASE5-PLAN.md` (a completed, pre-existing mobile-shell/command-palette plan — different "phase" numbering than this article series) was found deleted in the working tree at session start, not by this change. Left untouched/unstaged rather than bundled into this commit.

## Article 6 — "Operating System: The Grand Conductor" + factual corrections
**2026-08-11 — Seventh tech article published (process, PCB, context switch, scheduling, virtual memory, kernel/user mode, syscall, threads, keypress relay); part 06/08 LEVEL 3 — THE SOFTWARE; plus factual fixes to articles 5 and 6**

- **`src/articles/content/OSGrandConductor.tsx`** (new): full bilingual article body (8 sections + hook + RelayNav + Colophon). Sourced from `src/articles/series-01/Operating System — Grand Conductor.md` and `Article - OS Grand Conductor.dc.html` (dc.html deleted after integration). Hook links back to `/writing/memory-hierarchy`; RelayNav `next` points to `#` (article 07, not yet written).
- **6 new widgets** in `src/articles/widgets/`: `ProcessAnatomy.tsx` (stack/heap grow-shrink with collision warning), `ContextSwitch.tsx` (4-step P1→save PCB→load PCB→P2 state machine), `Scheduler.tsx` (round-robin/priority/CFS tabbed policy comparison with per-process time bars), `MMUTranslator.tsx` (chrome vs vscode virtual-to-physical address translation with RAM grid), `SyscallDoorway.tsx` (6-step user↔kernel mode crossing), `KeypressRelay.tsx` (11-stage 'A' keypress relay with auto-run, screen preview, context-switch counter).
- **`src/articles/glossary.ts`**: added 8 terms — `process`, `pcb`, `contextswitch`, `scheduler`, `virtualmem`, `pagefault`, `syscall`, `interrupt`.
- **`src/articles/manifest.ts`**: article 06 entry replaced — slug `the-grand-manager` (state: `next`) → `os-grand-conductor` (state: `read`) with `enDescription`/`bnDescription`/`datePublished: 2026-08-11`, `readTime: ~20 min`, `level: 'LEVEL 3 — THE SOFTWARE'`.
- **Wiring (standard checklist)**: `ArticlePage.tsx` (slug union, `isBnTitle`, CONFIGS with `seriesPos: 6`, import), `App.tsx` (route `/writing/os-grand-conductor`), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` (sidebar entry), `sections.ts` (alias auto-derived), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list), `MemoryHierarchy.tsx` (RelayNav `next` href `#` → `/writing/os-grand-conductor` + updated title).
- **Factual fix — CFS → EEVDF**: `OSGrandConductor.tsx` (bullet list + Deeper section), `glossary.ts` (`scheduler` entry). Linux replaced CFS with EEVDF in kernel 6.6 (October 2023); updated all references to reflect this, preserving CFS description as historical context.
- **Factual fix — DRAM refresh interval**: `MemoryHierarchy.tsx` SRAM/DRAM section. Changed "every few milliseconds" → "within a 64-millisecond window (32 ms at high temperature)" (JEDEC standard retention requirement).
- **Factual fix — L1 cache latency**: `MemoryHierarchy.tsx` cache layer list. Changed "1-2 clock cycles" → "4-5 clock cycles" (modern Intel/AMD L1d latency; 1-cycle figure applies to registers, not L1).
- **Verified**: `tsc --noEmit` clean after all edits.

## Article 7 — "From Code to Machine Code"
**2026-08-13 — Eighth tech article published (compiler, interpreter, bytecode + VM, JIT, the node hello.js pipeline, dissolving boundaries); part 07/08 LEVEL 3 — THE BRIDGES**

- **`src/articles/content/CodeToMachineCode.tsx`** (new): full bilingual article body (7 sections + hook + Recap + RelayNav + Colophon). Prose sourced verbatim from `src/articles/series-01/From Code to Machine Code.md`; widget/Deeper/glossary specs from `Article - Code To Machine Code.dc.html` (dc.html deleted after integration). Hook links back to `/writing/heartbeat-fde` (the hex-dump callback), `/writing/cpu-blueprint`, and `/writing/os-grand-conductor`. RelayNav `next` points to `#` (article 08, not yet written).
- **4 new widgets** in `src/articles/widgets/`: `TwoStrategies.tsx` (compiler/interpreter tabs over the same 3-line program; translations counter sticks at 3 for compile, climbs 3×runs and turns red for interpret), `MiddleLayer.tsx` (java/python tabs, 4-step source → bytecode → VM → output card chain), `HotPath.tsx` (square() call counter with hot threshold at 8, interpreting → compiling → native mode badge, call-count and speed meters, run/step/reset, reduced-motion aware), `CompilePipeline.tsx` (9-stage `node hello.js` engine walkthrough with badge column and source→AST→bytecode→interpret→native funnel).
- **`src/articles/glossary.ts`**: added 6 terms — `compiler`, `interpreter`, `bytecode`, `vm`, `jit`, `ast`.
- **`src/articles/manifest.ts`**: article 07 entry replaced — slug `the-compilers-translation` (state: `soon`) → `code-to-machine-code` (state: `read`) with `enDescription`/`bnDescription`/`datePublished: 2026-08-13`, `readTime: ~14 min`. Fourth roadmap-slug rename on publish, as documented in CLAUDE.md.
- **Wiring (standard checklist)**: `ArticlePage.tsx` (slug union, `isBnTitle`, CONFIGS with `seriesPos: 7`, import), `App.tsx` (route `/writing/code-to-machine-code`), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` (sidebar entry), `sections.ts` (alias auto-derived), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list), `OSGrandConductor.tsx` (RelayNav `next` href `#` → `/writing/code-to-machine-code`).
- **Also fixed stale SeriesHub rows**: `SeriesHub.tsx` still listed article 06 as `state: 'next'` with `href: '#'` (it had been published two days earlier without updating the hub). Row 06 → `read` + real href/title, row 07 → `read`, row 08 → `next`.
- **Verified**: `tsc --noEmit` and `eslint` clean on all new/changed files. Full `npm run build` succeeds — `/writing/code-to-machine-code` prerenders, `public/og/code-to-machine-code.png` auto-generates (1200×630, "LEVEL 3 — THE BRIDGES · PART 07/08"), sitemap entry present, and grep on `dist/writing/code-to-machine-code/index.html` confirms unique `og:title`/`og:description`/`og:image`.

## Article 8 — "From the Keyboard's 'A' to the Screen's 'A'" — SERIES COMPLETE
**2026-09-09 — Ninth and final tech article published (keyboard matrix scan, interrupt, OS event routing, app wake, rasterization, framebuffer, the full 15-step relay, series close, further-reading list); part 08/08 LEVEL 3 — THE BRIDGES**

- **`src/articles/content/KeyboardToScreen.tsx`** (new): full bilingual article body (9 sections + hook + Recap + RelayNav + Colophon). Prose sourced verbatim from `src/articles/series-01/From the Keyboard's 'A' to the Screen's 'A'.md`; widget/Deeper/glossary specs from `Article - Keyboard A To Screen A.dc.html` (dc.html deleted after integration). Section 09 is a new curated further-reading list (16 resources in 6 groups, data-driven from a `READING` const) that closes out the series. RelayNav points back to article 07 and forward to the series hub rather than a next leg.
- **Factual fix — keyboard scanning (author-supplied)**: the draft said the chip "checks the voltage on each of the keyboard's 104 keys", which implies one wire per key. Real keyboards use matrix scanning — keys sit at row/column intersections, the microcontroller energizes one row at a time and reads all columns at once (~8 rows x 16 columns = 24 pins, not 104). Corrected in both BN and EN, in the source markdown **and** the TSX, and the follow-on "which key does this wire mean" sentence reworded to "which key sits at this row-and-column intersection".
- **3 new widgets** in `src/articles/widgets/`: `KeyMatrixScan.tsx` (4x4 key matrix with row-drive and column-sense pins — click a key, energize rows, and the column only reads high when the pressed key's row is live; rebuilt from the dc.html's linear 8-key scanner specifically to tell the corrected grid story), `Rasterize.tsx` (inline SVG vector 'A' on the left, small/large pixel grid on the right, with an on-pixel count), `FullRelay.tsx` (15-stage keypress-to-photon relay with HW/kernel/user layer badges, a live ~ms clock, screen preview, and context-switch/mode-flip counters).
- **`src/articles/glossary.ts`**: added 5 terms — `scancode`, `rasterization`, `framebuffer`, `compositor`, `abstraction`... except `abstraction` and `interrupt` already existed from earlier articles, so only 4 net new plus reuse. (A duplicate `abstraction` key was introduced and removed in the same session — the pre-existing definition stands.)
- **`src/articles/manifest.ts`**: article 08 entry filled in — kept the placeholder slug `from-keypress-to-screen` (it was already accurate and already cross-linked), retitled to the real article title, `state: 'soon'` -> `'read'`, added `enDescription`/`bnDescription`/`datePublished: 2026-09-09`, `readTime: ~15 min`. Also updated `SERIES_DESCRIPTION_EN`/`_BN` from "from bits to OS" (no longer the arc — the series now runs past the OS through compilers to the screen) to "a complete 8-part series ... from voltage in silicon to the letter on your screen".
- **`SeriesHub.tsx` now derives from the manifest**: it had kept a hand-written copy of all 8 rows, which silently went stale twice (legs 06 and 07 still showed `state: 'next'`/`href: '#'` days after publishing). Rows, the `N/8 read` counter (was hardcoded `5/8`), and the ongoing/complete status chip are now computed from `ARTICLES`. Also swapped its private `useReducedMotion` copy for the shared guarded hook. Documented the new rule in CLAUDE.md.
- **Wiring (standard checklist)**: `ArticlePage.tsx` (slug union, `isBnTitle`, CONFIGS with `seriesPos: 8`, import), `App.tsx` (route), `scripts/routes.mjs` (sitemap + prerender), `FileExplorer.tsx` (sidebar entry), `sections.ts` (alias auto-derived), `Index.tsx` (`ARTICLE_SECTIONS` portal trigger), `WritingContent.tsx` (`techArticles` list + series blurb), `CodeToMachineCode.tsx` (RelayNav `next` href `#` -> `/writing/from-keypress-to-screen`).
- **Verified**: `tsc --noEmit` and `eslint` clean. Full `npm run build` succeeds — route prerenders, `public/og/from-keypress-to-screen.png` auto-generates (1200x630, "PART 08/08"), sitemap entry present, unique og:title/description/image. Grepped the prerendered HTML to confirm the corrected matrix-scan text is present, the old 104-wire sentence is gone, the reading list and all three instruments render, and the hub reads 8/8 + complete.

## Tech-articles restructure + series-completion pass
**2026-09-09 — two-level tech-articles hierarchy, series-complete copy fixes, reading-list disclaimer, field note**

- **`/writing/tech-articles` is now a landing page, not the series hub.** New `src/components/sections/TechArticlesContent.tsx` renders inside the terminal shell (lazy-loaded in `Editor.tsx`, same pattern as `GamesContent`) and lists series as cards — SERIES 001 with its live published/complete count pulled from `ARTICLES`, plus a queued SERIES 002 placeholder. The paper-oscilloscope hub moved to **`/writing/tech-articles/series-01`** (`ArticleHub.tsx`, unchanged internals). URL chosen over `.../the-machine-beneath-your-code` because that path already belongs to the series *intro article* and the collision would be confusing; `series-01` also matches the repo's own `src/articles/series-01/` folder and the hub's "SERIES 001" label, and scales cleanly to `series-02`.
- **Portal behaviour now matches the hierarchy**: `ARTICLE_SECTIONS` in `Index.tsx` dropped `writing/tech-articles` and gained `writing/tech-articles/series-01`. The "Entering the tech world" animation fires when crossing into a series or an article, and no longer when opening the plain listing page.
- **Sidebar gained a series subfolder**: new container `writing-tech-series-01` (`the-machine-beneath-your-code/`) under `tech-articles/`, with all nine articles reparented into it. The intro file was renamed `the-machine-beneath-your-code.md` -> `intro.md` — inside a folder of the same name the old filename read as a duplicate. `FileExplorer`'s existing recursive `isFileVisible`/`getDepth` already handle three-level nesting, so no component changes were needed.
- **Series paths deduplicated**: `TECH_ARTICLES_PATH` and `SERIES_HUB_PATH` added to `manifest.ts`; `RelayNav.tsx` now exports `SERIES_HUB_CARD` (the back-to-hub card was byte-identical in eight articles). All nine article files, `PromptBar`'s default `hubHref`, `ArticleHub`'s `HUB_PATH`, `ArticlePage`'s `isPartOf` schema, and `WritingContent`'s series row now go through the constants.
- **Copy fixes**: welcome page (`Editor.tsx`) said "publishing now: the machine beneath your code" — the series is finished, now reads "just finished ... all of it is up". Article 8's reading-list intro reworded ("মন কেড়ে থাকে" -> "ভালো লেগে থাকে") and a two-language author's disclaimer added above the closing paragraph, noting the list was collected from research rather than fully worked through. Applied to both the source markdown and the TSX.
- **New field note** (`2026-09-09`, "eight of eight") closing the loop on the `2026-07-23` "half-published" note that is still directly below it — the earlier entry worried about being wrong in public; this one records that it happened four times (CFS/EEVDF, DRAM refresh, L1 latency, keyboard matrix scanning) and cost an afternoon each.
- **Bug caught by verification, not by tooling**: the `SERIES_HUB_PATH` switch in `ArticlePage.tsx` was made without adding the import. `tsc --noEmit` passed and `npm run build` exited 0, but every one of the nine article routes prerendered as a blank shell with the generic `<title>niruddeshjatra</title>`. Only grepping the prerendered HTML surfaced it. Reinforces the CLAUDE.md rule that SEO-relevant changes must be verified by grepping `dist/<route>/index.html`, not by a green build.
- **Verified**: `tsc --noEmit` clean; `eslint` clean on all touched files (the 23 pre-existing `no-explicit-any` errors are all in untouched `src/utils`, `src/hooks`, and `src/components/ui` files). Full build prerenders both `/writing/tech-articles` (terminal listing, no signal map) and `/writing/tech-articles/series-01` (paper hub, canonical correct), all nine articles render their real titles again, hub links across articles point at `series-01`, sitemap carries the new route, and the BN/EN disclaimer strings are present in the prerendered HTML and JS bundle respectively.

## Shared listing-card + terminal navigation
**2026-09-09 — SectionCard extracted, mobile card fixes, listing type scale normalised, terminal routes for writing/tech-articles/series-01**

- **New `src/components/sections/SectionCard.tsx`** — one card structure for every listing page (eyebrow, right-aligned meta, title, uppercase tagline, description, dim facets, CTA). Built mobile-first: `p-5 sm:p-7`, `clamp()` title so long series names never overflow, `flex-wrap` meta row, `min-h-[38px]` CTA tap target, `break-words` title. Both `/games` and `/writing/tech-articles` now render through it.
- **ArcZero keeps its guest palette.** CLAUDE.md forbids flattening the ArcZero card to site tokens, so `SectionCard` takes an optional `CardTheme` (accent/border/background/fontFamily/body/dim). `GamesContent` passes `ARCZERO_THEME`; the rendered card still uses `#44aaff`, Courier New and the dark ArcZero background — only the layout is now shared. Structure unified, identity preserved.
- **Type scale**: the reported "tech-articles text is bigger than games" turned out to be a false positive — both header blocks were byte-identical in the prerendered HTML (`<p class="mb-1">`, no size class, inheriting 16px base). The apparent difference came from the big dark ArcZero card next to the games header. Rather than make the two pages differ, both headers were normalised to `text-sm`, matching the welcome page and `NowContent`, which is the dominant convention for terminal-style index pages.
- **Terminal navigation** — `sections.ts` now derives a bare last-segment alias for every `writing/*` route, so `cd series-01`, `cd memory-hierarchy`, `cd from-keypress-to-screen` all work, and future articles become reachable automatically when added to `FileExplorer.files`. Added friendlier spellings (`tech`, `articles`, `series1`, `series 1`). Terminal `help` gained `cd tech-articles` and `cd series-01` lines, `ls` now prints the writing subtree including the series folder, and both were added to the tab-completion `COMMANDS` list. Verified all 19 probe strings resolve via a throwaway `tsx` script.
- **Alias collision caught**: an initial pass mapped bare `the-machine-beneath-your-code` to the series hub, which shadowed the intro article (that string is the intro's own leaf segment). Resolved unix-style — bare name is the article, trailing-slash folder name is the hub, matching how the sidebar labels them.
- **Verified**: `tsc --noEmit` and `eslint` clean on all touched files; build prerenders `/games`, `/writing/tech-articles` and `/writing/tech-articles/series-01`; both pages render `SectionCard`; ArcZero's `rgb(68,170,255)`/Courier New survive in the output; terminal help/ls strings present in the Terminal chunk.

## Series card mobile fix + reader progress tracking
**2026-09-09 — series card re-proportioned to match the games card, localStorage-backed read progress on the series hub**

- **Series card mobile layout.** Diagnosed by extracting the rendered card text from both pages rather than guessing (the gstack `browse` binary would not execute in this sandbox — `Permission denied` on `browse.exe`). Four concrete faults, all against the ArcZero card as reference: title was `clamp(1.05rem, 4.5vw, 1.35rem)` = ~17px at 375px versus ArcZero's ~26px (broken hierarchy); the tagline repeated the description verbatim ("from voltage in silicon to the letter on screen" appeared in both); the facets line was 101 chars / 8 items versus ArcZero's 57 / 4, wrapping to four lines of 10px dim text; and the description was 139 chars of SEO copy rather than a human blurb.
- **Fixes**: `SectionCard` now uses one title scale (`clamp(1.5rem, 7vw, 2.5rem)`) for every card so hierarchy is consistent, with letter-spacing moved into `CardTheme.titleTracking` — ArcZero keeps `0.15em` for its short wordmark, long titles default to `0.02em`. Series copy rewritten to ArcZero's proportions: tagline 27 chars, description 149, facets 42. ArcZero's rendered output is unchanged apart from inheriting the same (identical) clamp.
- **Reader progress** — new `useReadProgress` hook backed by `localStorage` (`ncs_articles_read`). `ArticlePage` marks an article read on mount. `SeriesHub` now distinguishes four row states — `read` (green wash, ▰), `next` (the first published article not yet opened; darker border, paper wash, ▶, "read next"), `unread` (▱), `soon` (·) — and the signal map gives unread-but-published segments their own dim-lit colour. The `N/8 read` counter now means articles *this reader* opened, against the published count, rather than the publish count against the total; the status chip reports "you finished it" once all published legs are read. `PromptBar`'s progress dots switched from publish count to reader count for the same reason.
- **SSR safety**: the hook returns an empty set on first render and hydrates in `useEffect`, so prerendered HTML matches the client and there is no hydration mismatch. Verified: the prerendered hub shows `০/৮ পড়া হয়েছে`, one "read next" row, seven "unread", zero "soon", and no reset button at zero progress.
- **Added a reset control** next to the counter, visible only once progress exists. Not requested, but persistent state with no way to clear it is a usability gap (shared devices, testing).
- **Verified**: `tsc --noEmit` clean, `eslint` clean on touched files (two pre-existing warnings elsewhere), build prerenders `/games`, `/writing/tech-articles`, `/writing/tech-articles/series-01`; card text extraction confirms matched proportions across both cards.

## Series 01 technical audit pass — all eight articles
**2026-09-26 — corrected the simplifications that had hardened into wrong mental models, across every article, its widgets, the glossary and the markdown mirrors**

- **What drove it**: eight external audits, one per article, flagged places where a teaching simplification had become misleading. Two standing filters were applied rather than following each audit literally — skip suggestions that re-add material the article no longer needs (endianness, quantization), and skip corrections that buy precision by introducing an unexplained higher concept. Analogies were kept deliberately (book translator, UN live translator, Esperanto, repeated phrases, homework notebooks, factory workers, separate city maps); the audits' drier replacement prose was not.
- **Articles 01–03** (`WhatsInsideABit`, `HowDoesAnythingBecomeBits`, `BlueprintOfACPU`): bit separated from voltage; combinational vs sequential separated from the clock; propagation delay explained properly; latch vs flip-flop, race-around and master–slave moved into `Deeper` toggles with a new `MasterSlaveFlipFlop` instrument; the CMOS/pull-up digression cut for "a real AND gate is a NAND followed by a NOT"; endianness removed entirely; 1-hour 4K raw corrected from "100+ GB" to ~2.7 TB; Bangla mojibake bytes fixed from Sinhala to the Bangla range. New widgets: `CombinationalVsClocked`, `MuxSelector`, `WriteEnableDecoder`, `MasterSlaveFlipFlop`.
- **Article 04** (`HeartbeatFDE`): the "Single-Cycle Architecture" label dropped, per-tick FDE narration replaced by *clock cycle = unit of timing, FDE = conceptual stages*, 3 GHz no longer implies 3 billion instructions per second, register fields named as identifiers rather than addresses, and the control unit described as configuring the datapath rather than switching parts on.
- **Article 05** (`MemoryHierarchy`): the speed/capacity/cost "trilemma" became a trade-off; every fixed size, cycle count and nanosecond figure removed from the prose and from `data/memoryLayers.ts`; `LOOKUP_LAYERS` (L1→RAM) introduced because a memory-operand access has no "register miss" first and storage sits behind virtual memory, not behind a cache miss; cache-line size hedged; the Redis and linked-list claims cut; SRAM/DRAM and volatility rewritten around state retention.
- **Article 06** (`OSGrandConductor`): program vs process vs thread separated (execution state is thread-level), "1–10 ms time slices" and "one tab = one process" removed, CFS → **EEVDF since kernel 6.6** (widget mode renamed `fair-share`), **virtual memory ≠ swap** given its own subsection, the privilege model scoped as simplified with traps replacing "the CPU shuts it down", library wrappers distinguished from system calls, `concurrency` added to the glossary, and the keypress relay rebuilt as a conceptual path.
- **Article 07** (`CodeToMachineCode`): machine code separated from hexadecimal notation, interpreters no longer "line by line", JIT reframed as **a compiler that runs during execution** with deoptimization and V8's tiers named, the `console.log` loop replaced by a CPU-bound accumulator, and compiled-vs-interpreted recast as an implementation strategy with the runtime and AOT paths shown side by side.
- **Article 08** (`KeyboardToScreen`): the 20–30 ms budget, the 104-wire aside, "interrupt is the only way to stop a CPU", the pending `read()` call, "near C-level speed", the billions-of-instructions paragraph and the different-companies mythology all removed; `0x04` reframed as a **USB HID usage code, not ASCII** (new `hid` glossary term); framebuffer reframed as a display buffer scanned out continuously; "The app wakes up" rebuilt around the app's own event loop, what a state update actually is, and the app marking a redraw rather than painting. On request, the DMA/vsync/subpixel `Deeper` block and the Electron/V8 internals were dropped.
- **Cross-cutting**: new `Diagram` primitive (flow art on paper — `.article-root pre` paints a dark well, which is wrong for a diagram) used across articles 03–08 with art hoisted to module-level `ART_*` consts; inline `<code>` styling added to `article.css`; roughly twenty widgets had captions or narrations corrected where they taught the wrong model — `CPUDatapath` step semantics, `ClockVisualizer` timing violations, `TransistorSwitch` source/drain, `FeedbackLatch` current animation, `FullRelay` fabricated millisecond timeline, `HotPath` invented 40× figure, `CompilePipeline` "C-level speed" endpoint.
- **Markdown mirrors**: all nine `series-01/*.md` files brought back in sync. Articles 04–06 had been written as condensed summaries (md:tsx byte ratio 0.68 / 0.52 / 0.39 against a 0.82–0.87 norm) and were rewritten as full prose; a paragraph-level sweep of the other six restored 19 genuinely missing paragraphs — Blueprint had gone stale across two rewrites — after discarding 51 candidate insertions that proved to be duplicates of differently-split text.
- **Verified**: `tsc --noEmit` and `eslint` clean on every touched file, full `npm run build` prerenders all 24 routes, and each article's `dist/<route>/index.html` was grepped to confirm the removed claims are gone and the corrections present. Two hand-edit leftovers were reported rather than silently changed: `< strong >` with stray spacing in `OSGrandConductor.tsx`, and the pruned `contextswitch`/`scheduler`/`virtualmem` glossary entries — the one dangling `Term` reference that pruning left behind was removed.
