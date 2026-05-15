# nasiful-coder-space — Project Brain

## What This Is
A developer portfolio site built with React 19 + TypeScript + Vite + Tailwind. Features a VS Code-inspired UI with interactive terminal, file explorer, and theme switching. Deploys to Vercel.

## Stack
- Runtime: Node.js / Vite dev server
- Language: TypeScript
- Framework: React 19
- UI: Tailwind CSS + Radix UI + shadcn/ui (`components.json`)
- Testing: Vitest (unit) + Playwright (E2E)
- Linting: ESLint + Prettier
- Deploy: Vercel

## File Structure
```
src/
├── components/
│   ├── sections/         # Page content sections; EssayContent.tsx is shared wrapper for prose essays
│   ├── ui/               # shadcn/ui primitives
│   ├── Editor.tsx        # Main VS Code-style editor pane; per-section skeleton fallbacks
│   ├── FileExplorer.tsx  # Sidebar file tree — authoritative `files` array + hierarchy
│   ├── Terminal.tsx      # Interactive terminal component
│   ├── ResponsiveLayout.tsx  # Root layout — single layout, mobile-aware via viewport.isMobile
│   ├── MobileFileDrawer.tsx  # Slide-in file drawer (mobile only); reuses FileExplorer
│   ├── MobileTerminalSheet.tsx  # Slide-up terminal sheet (mobile only); reuses Terminal
│   ├── CommandPalette.tsx    # Cmd+P / Cmd+Shift+P palette (cmdk, lazy-loaded)
│   ├── ResponsiveHeader.tsx  # Top nav / menu bar
│   ├── StatusBar.tsx     # Bottom VS Code status bar
│   ├── ThemeSwitcher.tsx # Dark/light/system theme toggle
│   ├── MatrixBackground.tsx  # Animated matrix background (density 0.6, 50ms frame)
│   ├── IntroLoader.tsx   # First-visit terminal typing intro (sessionStorage-gated, lazy-loaded)
│   └── PortalLoader.tsx  # Sub-world transition scramble + cloud-dissolve (sessionStorage-gated, lazy-loaded)
├── pages/
│   ├── Index.tsx         # Home page; accepts optional `forceSection` prop to override URL-derived section
│   └── NotFound.tsx      # Legacy stub — no longer used; catch-all routes now use Index forceSection="404"
├── hooks/
│   ├── useCommandPalette.ts  # Palette open/mode state
│   ├── useLoader.ts      # IntroLoader + PortalLoader state; sessionStorage gating per area
│   └── ...               # Other custom hooks
├── lib/
│   ├── matrixChars.ts    # Shared katakana/digit char arrays — source of truth for MatrixBackground
│   ├── quotes.ts         # QUOTES array (30 entries) + getTodaysQuote() — day-stable rotating quote
│   └── ...               # Other shared utilities
└── constants/
    ├── sections.ts       # SECTION_ALIASES — derived from FileExplorer.files (skips containers)
    └── ...               # Other static data
```

## Sidebar File Tree

Canonical folder structure in `FileExplorer.files`:
```
me/                  → container (expand/collapse, no section)
  about.md           → about
games/               → games
writing/             → writing (container, also navigable)
  essays/            → container (id: writing-essays, no section)
    on-forgetting.md          → writing-essays-on-forgetting (newest first)
    on-staying-small.md       → writing-essays-on-staying-small
    on-running-for-nothing.md → writing-essays-on-running-for-nothing
  tech-articles/     → container (id: writing-tech-articles, no section)
journey/             → container (id: journey)
  running.md         → journey-running
  hiking.md          → journey-hiking
field-notes/         → field-notes
photos/              → photos
now.md               → now
contact.md           → contact
```

`FileItem` interface (in `FileExplorer.tsx`):
```typescript
interface FileItem {
  id?: string;         // set on container folders (me, work, writing)
  name: string;
  section: string;     // empty string for containers — skipped in SECTION_ALIASES
  icon: typeof File;
  parent?: string;     // matches parent container's id
  isContainer?: boolean;
}
```

Adding a new navigable section: add a `FileItem` with `section` set, `parent` pointing to the appropriate container id. `sections.ts` picks it up automatically.

Adding a new container folder: add a `FileItem` with `isContainer: true`, `id` set, `section: ''`. Add children with `parent` matching that id.

**Multi-level nesting**: `FileExplorer` uses `isFileVisible(f)` (recursive parent-chain check) and `getDepth(f)` for indent (`pl-1` / `pl-4` / `pl-7`). Containers can be nested — a child container must have its parent's `id` in `parent`. `sections.ts` skips items where `section === ''`.

## Key Conventions
- Functional components + hooks only — no class components
- Tailwind CSS for all styling — no inline styles, no CSS modules
- shadcn/ui for UI primitives — add via `npx shadcn-ui@latest add <component>`
- Named exports for components; default export for pages
- No `any` types — proper TypeScript interfaces required
- Project/skills data lives in `src/constants/` — never hardcoded in components
- **Section aliases** live in `src/constants/sections.ts`, derived from `FileExplorer.files` — never duplicate this map in components. Skips items where `section === ''` (container folders).
- **Mobile layout**: `ResponsiveLayout` serves both mobile and desktop from one component — no separate MobileShell. When `viewport.isMobile`, renders: top header (`niruddeshjatra` brand + hamburger), `MobileFileDrawer` (off-canvas), `<main pb-11>` with `Editor`, and `MobileTerminalSheet` (fixed bottom, 44px collapsed / 60vh expanded). No bottom nav. No search button. No status strip.
- **MobileFileDrawer**: wraps `FileExplorer` in a slide-in drawer. Never reimplement the file tree — always reuse `FileExplorer`.
- **MobileTerminalSheet**: wraps `Terminal` in a slide-up sheet. Collapsed bar = 44px. Expanded = 60vh. Terminal is lazy-loaded inside. Never reimplement terminal logic.
- **CommandPalette** is lazy-loaded; `meta+p` = files, `meta+shift+p` = commands; always guard against `HTMLInputElement` focus before opening
- **FileExplorer owns its width** — do NOT set `w-*` on the wrapper div in `ResponsiveLayout`. Collapsed = `w-8`, expanded = `w-48`, managed internally. To widen for a specific context (e.g. mobile drawer), pass `navClassName="!w-64"` — the prop appends to the nav's class list with Tailwind override.
- **FileExplorer headerAction prop** — pass `headerAction?: React.ReactNode` to replace the default collapse-chevron in the WORKSPACE header. Used by `MobileFileDrawer` to inject the X close button into the existing header row instead of adding a second row. Desktop always uses default (no prop).
- **MobileFileDrawer has no explicit width** — width is driven by `FileExplorer`'s nav. Pass `navClassName` to FileExplorer to control it. Never re-add a `w-*` to the drawer `<nav>` wrapper.
- **MatrixBackground backdrop-blur removed** — `.editor-content` div in `Editor.tsx` uses only `bg-black/10`, not `bg-black/10 backdrop-blur-sm`. On mobile, `Editor.css` applies `transform: translateZ(0); will-change: transform` which promotes `.editor-content` to a GPU compositing layer; `backdrop-filter` on that layer blurs the wrong compositing boundary and produces a visible dark overlay. Do not re-add `backdrop-blur` to `.editor-content`.
- **MobileTerminalSheet keyboard offset** — uses `visualViewport` API to compute `keyboardOffset` when expanded. Sheet position: `style={{ bottom: keyboardOffset, height: isExpanded ? '60vh' : '44px' }}`. Degrades gracefully (offset stays 0) when `visualViewport` unavailable.
- **MobileTerminalSheet swipe-down** — touch handlers on drag handle (50px threshold). Handle has `touch-none` to prevent scroll interference. Tap-outside-to-close handler is separate and still active.
- **Lazy section loading** — all sections in `Editor.tsx` are `React.lazy`. Each has a dedicated skeleton fallback (see `getSectionSkeleton`). Do not use generic "loading..." text.
- **Section page design**: code-as-self style — monospace, comment blocks, `const` objects. No generic resume bullet points. `max-w-xl mx-auto` for short-form sections; `max-w-2xl` only for prose pages (DraftAbout, future blog).
- **Color system — phosphor palette**: use `text-phosphor` (accent/markers), `text-phosphor-soft` (string values), `text-phosphor-dim` (comments, metadata), `text-danger` (errors). `terminal-{cyan,purple,yellow,orange,blue,green}` classes are **retired** — do not use anywhere in `src/`.
- **Font**: Departure Mono is primary (`public/fonts/DepartureMono-Regular.woff2`). JetBrains Mono is fallback. Both declared in `tailwind.config.ts` `fontFamily.mono`.
- **File-signature footer**: completed section components end with `— nj · YYYY-MM · N bytes` in `text-phosphor-dim`. Byte counts are hardcoded per section — see each component.
- **Terminal output**: ASCII markers only — `>` for nav/status, `!` for errors, `ok ·` for success, `•` for lists. No emoji in `Terminal.tsx` output strings.
- **Loader overlays** (`IntroLoader`, `PortalLoader`) must render opaque by default (no initial `opacity:0` or `visibility:hidden` inline style). This matches the Suspense fallback (`bg-background`) so there is no flash between fallback unmount and first paint. Use `useLayoutEffect` for any DOM pre-population that must happen before paint (e.g. pre-filling scrambled text in PortalLoader).
- **Matrix chars** — `KATAKANA`, `DIGITS`, `CHARS` live in `src/lib/matrixChars.ts`. Import from there; do not redeclare in components.
- **Loader sessionStorage keys** — all in `useLoader.ts`; do not gate loaders with ad-hoc sessionStorage calls in components.
- **Portal manual trigger** — `usePortalLoader()` returns `triggerPortal({ destination, sessionKey?, onComplete? })`. Use this when a component needs to fire the portal on a user action (e.g. PLAY button) rather than on route change. The trigger skips the sessionStorage gate and does not auto-set any flag. `onComplete` fires after the portal animation completes. The route-driven gate still handles the case where the user navigates directly to the URL.
- **Welcome page layout**: left-aligned terminal-output, no `max-w-*` constraint on the outer container. Prose pages (about.md, future essays) keep `max-w-2xl` centered. This split is intentional — do not add `max-w-*` to the default branch in `Editor.tsx`.
- **Changelog data shape**: `src/constants/changelog.ts` owns `ChangelogEntry { hash, date, message }` — git-log style, not date/section/summary. `Changelog.tsx` renders a 3-column CSS grid (`grid-cols-[7ch_7ch_1fr]`); HEAD hash renders in `text-phosphor`, others in `text-phosphor-dim`.
- **Quote rotation**: `getTodaysQuote()` from `src/lib/quotes.ts` — stable per-day index (`year * 365 + dayOfYear`), computed once at render. No state, no animation, no user interaction. Do not add a refresh button or rotator.
- **Field notes pages**: `FieldNotesContent.tsx` renders dated short-form observations. NOT wrapped in `EssayContent`. Pattern: frame paragraph (`> prefix`), then `<article>` blocks newest-first, each with date + title line + prose paragraphs. Bangla blockquotes carry `lang="bn"` for the `index.css` font rule. No expand/collapse, no pagination, no tags.
- **Guest design language**: the ArcZero card in `GamesContent.tsx` intentionally uses ArcZero's own design tokens (`#44aaff`, Courier New, `rgba(10,10,15,0.92)` background, `rgba(68,170,255,0.4)` border) — NOT the site's phosphor palette. This is by design: the card announces ArcZero's identity. Do not "fix" it to use site tokens.
- **Essay pages**: use `EssayContent.tsx` as the shared wrapper (`title`, `subtitle`, `currentLang`, `alternateLangPath`, `readTime`, `wordCount`, `lastUpdated`, `children`). English title: `text-xl tracking-[0.15em] uppercase`. Bengali title: `text-xl tracking-[0.1em]` (no uppercase — Bangla has no case). Both have `text-foreground/45` subtitle, no `>` prefix marker.
- **Bengali font**: `[lang="bn"]` rule in `src/index.css` sets Noto Sans Bengali weight 500, `letter-spacing: 0.02em`, `line-height: 1.9`. The `lang="bn"` attribute is set on the `EssayContent` root div when `currentLang === 'bn'`. Do not set inline font styles in components.
- **MatrixBackground opacity**: component accepts `opacity?: number` prop (default: internal 0.25). `Editor.tsx` passes `opacity={0.08}` on `writing/*` routes. Prefix check is `currentSection?.startsWith('writing')` — no trailing slash (matches `writing`, `writing-essays-*`, etc.).
- **Terminal auto-collapse**: `ResponsiveLayout` owns `isTerminalFocused` state. Reading pages (`writing/*`): collapsed = 72px, others: collapsed = 132px. Expanded = 288px. Transitions 200ms ease-out. Click-outside (`data-terminal-region` attribute) and Escape key both collapse. Do NOT persist to localStorage. Terminal input row is a standalone `shrink-0` element between header and history — always visible in collapsed state.
- **404 sentinel**: unmatched React Router routes render `<Index forceSection="404" />`. `Editor.tsx` maps `"404"` → `<NotFoundContent />` and uses `useLocation()` to display `location.pathname + ".404"` in the file header. Do NOT use the legacy `NotFound.tsx` page for new 404 handling.
- **vercel.json rewrite order**: ArcZero proxy rewrites must come BEFORE the SPA fallback `/(.*) → /index.html`. First match wins. Never move the SPA fallback above the game rewrites.
- Commit format: `type(scope): description` (feat/fix/chore/refactor/docs)

## Storage Keys
All keys namespaced `ncs_*` to avoid collisions.

**localStorage** (persists across sessions):
| Key | Type | Purpose |
|-----|------|---------|
| `ncs_sidebar_collapsed` | `"true" \| "false"` | FileExplorer collapsed state |
| `ncs_folders_expanded` | `JSON string[]` | Set of expanded container folder ids |

**sessionStorage** (resets on tab close — managed by `useLoader.ts`):
| Key | Type | Purpose |
|-----|------|---------|
| `ncs_intro_seen` | `"true"` | IntroLoader shown once per tab session |
| `ncs_portal_seen_games` | `"true"` | PortalLoader gate for /games area |
| `ncs_portal_seen_writing` | `"true"` | PortalLoader gate for /writing area |
| `ncs_portal_seen_blog` | `"true"` | PortalLoader gate for /blog area |
| `ncs_portal_seen_arczero` | `"true"` | PortalLoader gate for /games/arczero (set alongside games key) |

## Commands
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npx tsc --noEmit     # Type check
npx vitest           # Run unit tests
npx playwright test  # Run E2E tests
```

## AI Agents Available
| Agent | Purpose |
|-------|---------|
| code-reviewer | Review for bugs, security, quality |
| debugger | Interactive DAP debugging |
| test-writer | Vitest unit + Playwright E2E tests |
| refactorer | Clean up without changing behavior |
| doc-writer | Docs and comments |
| security-auditor | XSS, secrets, dependency CVEs |

## Custom Commands
- `/fix-issue <number>` — Fix a GitHub issue end-to-end
- `/deploy <env>` — Deploy to staging or production via Vercel
- `/pr-review <number>` — Full PR review and comment

## Skills Active
- `portfolio-review` — Audits portfolio completeness and recruiter-readiness. Trigger: "review my portfolio", "is it ready", "pre-deploy check"
- `after-change` (global) — Update docs + CLAUDE.md, commit, push. Trigger: "after each change", "update docs and commit", "land these changes"

## gstack
gstack installed at `~/.claude/skills/gstack`. Use `/browse` for all web browsing — never use `mcp__claude-in-chrome__*` tools.

Available skills:
`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/retro`, `/investigate`, `/document-release`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`

## Progression Log

Full sequential history of site phases lives in `PROGRESSION.md`. Read it for context on *why* things are structured the way they are. Updated by `after-change` on every commit.

## Security Notes
- Never commit `.env` files — all secrets via Vercel environment variables
- No user input reaches `eval` or `dangerouslySetInnerHTML` without sanitization
- Contact form inputs validated client + server side
