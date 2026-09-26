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
scripts/
├── routes.mjs            # SINGLE SOURCE OF TRUTH for all prerenderable routes. Exports ROUTES (objects: path/priority/changefreq/alternate) and ROUTE_PATHS (flat path list). Import here, not in prerender.mjs
├── prerender.mjs         # Post-build SSG: serves dist, crawls ROUTE_PATHS via puppeteer-core (local Chrome, else @sparticuz/chromium), writes index.html per route; hard-fails in CI if no browser resolves
├── generate-og.mjs       # Generates public/og-image.png (site) + public/og/<slug>.png per published article/hub via sharp — reads src/articles/manifest.ts + src/lib/site.ts, run via tsx (runs before vite build)
├── generate-sitemap.mjs  # Generates public/sitemap.xml + public/robots.txt from ROUTES — do not hand-edit either file. Reads src/lib/site.ts, run via tsx (runs before vite build)
├── generate-favicons.mjs # Generates all favicon variants in public/ via sharp (runs before vite build)
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
├── articles/
│   ├── article.css       # Paper-oscilloscope design system: aged-paper bg, fonts, scanlines, animations
│   ├── context/          # LanguageContext (BN/EN toggle) + TermContext (hover-definition popup state)
│   ├── primitives/       # Shared article blocks: PromptBar, Kicker, Section, Instrument, Caption, Diagram, Term, Deeper, Recap, etc.
│   ├── widgets/          # Interactive instruments: NoiseVsBands, TransistorSwitch, GatePlayground, FeedbackLatch, MasterSlaveFlipFlop, ThreeBits, AbstractionStack, ProtagonistDisguises, PlaceValueBuilder, UnicodeEncodingDemo, PixelColorDemo, SamplingRateDemo, RLECompressionDemo, CPUBlindLens, AdderWidget, CombinationalVsClocked, MuxSelector, WriteEnableDecoder, CPUDatapath, ClockVisualizer, InstructionAnatomy, ProgramCounterDemo, FetchDecodeExecute, InstructionCycleLoop, PipelineVisualizer, MemoryPyramid, LatencyScale, CacheLineLocality, RowColumnTraversal, SRAMvsDRAM, MemoryLookupCascade, ProcessAnatomy, ContextSwitch, Scheduler, MMUTranslator, SyscallDoorway, KeypressRelay, TwoStrategies, MiddleLayer, HotPath, CompilePipeline, KeyMatrixScan, Rasterize, FullRelay
│   ├── content/          # Article content modules: SeriesHub, MachineBeneathYourCode, WhatsInsideABit, HowDoesAnythingBecomeBits, BlueprintOfACPU, HeartbeatFDE, MemoryHierarchy, OSGrandConductor, CodeToMachineCode, KeyboardToScreen
│   ├── data/             # Article data shared by several widgets (memoryLayers.ts)
│   ├── series-01/        # Markdown mirror of every published article (BN block, then EN) — reference copy, not imported by the app
│   ├── glossary.ts       # Bilingual term definitions keyed by id — single source of truth for Term hover cards
│   └── manifest.ts       # Article metadata: slugs, titles, kicker cells, Content component refs
├── pages/
│   ├── Index.tsx         # Home page; accepts optional `forceSection` prop to override URL-derived section
│   ├── ArticlePage.tsx   # Standalone wrapper for individual articles; provides LanguageProvider + TermProvider
│   ├── ArticleHub.tsx    # Standalone series hub page (writing/tech-articles)
│   └── NotFound.tsx      # Legacy stub — no longer used; catch-all routes now use Index forceSection="404"
├── hooks/
│   ├── useCommandPalette.ts  # Palette open/mode state
│   ├── useLoader.ts      # IntroLoader + PortalLoader state; sessionStorage gating per area
│   └── ...               # Other custom hooks
├── lib/
│   ├── site.ts            # SITE_URL/SITE_NAME/SITE_AUTHOR — single source, import here instead of re-declaring
│   ├── matrixChars.ts    # Shared katakana/digit char arrays — source of truth for MatrixBackground
│   ├── quotes.ts         # QUOTES array (30 entries) + getTodaysQuote() — day-stable rotating quote
│   ├── structuredData.ts # JSON-LD structured data helpers (WebSite, Person, Article schemas)
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
  tech-articles/     → writing/tech-articles (container AND navigable; id: writing-tech-articles)
    the-machine-beneath-your-code/   → writing/tech-articles/series-01 (container AND navigable; id: writing-tech-series-01)
      intro.md                       → writing/the-machine-beneath-your-code
      whats-inside-a-bit.md          → writing/whats-inside-a-bit
      how-does-anything-become-bits.md → writing/how-does-anything-become-bits
      cpu-blueprint.md               → writing/cpu-blueprint
      heartbeat-fde.md               → writing/heartbeat-fde
      memory-hierarchy.md            → writing/memory-hierarchy
      os-grand-conductor.md          → writing/os-grand-conductor
      code-to-machine-code.md        → writing/code-to-machine-code
      from-keypress-to-screen.md     → writing/from-keypress-to-screen
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
- **Terminal navigation aliases** — `sections.ts` derives a bare last-segment alias for every `writing/*` route (`cd series-01`, `cd memory-hierarchy`, `cd from-keypress-to-screen`), so new articles become terminal-reachable automatically once added to `FileExplorer.files`. Plus hand-written spellings: `tech`, `articles`, `series1`, `series 1`. Unix-like disambiguation: bare `the-machine-beneath-your-code` is the intro *article*; `the-machine-beneath-your-code/` (trailing slash, the folder) is the series hub.
- **Section aliases** live in `src/constants/sections.ts`, derived from `FileExplorer.files` — never duplicate this map in components. Skips items where `section === ''` (container folders).
- **Mobile layout**: `ResponsiveLayout` serves both mobile and desktop from one component — no separate MobileShell. When `viewport.isMobile`, renders: top header (`niruddeshjatra` brand + hamburger), `MobileFileDrawer` (off-canvas), `<main pb-11>` with `Editor`, and `MobileTerminalSheet` (fixed bottom, 44px collapsed / 60vh expanded). No bottom nav. No search button. No status strip.
- **MobileFileDrawer**: wraps `FileExplorer` in a slide-in drawer. Never reimplement the file tree — always reuse `FileExplorer`.
- **MobileTerminalSheet**: wraps `Terminal` in a slide-up sheet. Collapsed bar = 44px. Expanded = 60vh. Terminal is lazy-loaded inside. Never reimplement terminal logic.
- **CommandPalette** is lazy-loaded; `meta+p` = files, `meta+shift+p` = commands; always guard against `HTMLInputElement` focus before opening
- **FileExplorer owns its width** — do NOT set `w-*` on the wrapper div in `ResponsiveLayout`. Collapsed = `w-8`, expanded = `w-48`, managed internally. To widen for a specific context (e.g. mobile drawer), pass `navClassName="!w-64"` — the prop appends to the nav's class list with Tailwind override.
- **FileExplorer headerAction prop** — pass `headerAction?: React.ReactNode` to replace the default collapse-chevron in the WORKSPACE header. Used by `MobileFileDrawer` to inject the X close button into the existing header row instead of adding a second row. Desktop always uses default (no prop).
- **MobileFileDrawer has no explicit width** — width is driven by `FileExplorer`'s nav. Pass `navClassName` to FileExplorer to control it. Never re-add a `w-*` to the drawer `<nav>` wrapper.
- **MatrixBackground backdrop-blur removed** — `.editor-content` div in `Editor.tsx` uses only `bg-black/10`, not `bg-black/10 backdrop-blur-sm`. On mobile, `Editor.css` applies `transform: translateZ(0); will-change: transform` which promotes `.editor-content` to a GPU compositing layer; `backdrop-filter` on that layer blurs the wrong compositing boundary and produces a visible dark overlay. Do not re-add `backdrop-blur` to `.editor-content`.
- **MobileTerminalSheet keyboard offset** — uses `visualViewport` API to compute `keyboardOffset` and `viewportHeight` when expanded. Sheet height: `60vh` normally; when keyboard is open (`keyboardOffset > 0`), clamps to `viewportHeight - 8px` to prevent the sheet from going off-screen. Inner terminal div uses `h-[calc(100%-2rem)]` (not a hardcoded `60vh` value). Degrades gracefully (offset stays 0) when `visualViewport` is unavailable.
- **Terminal mobile props** — `hideMobileTips?: boolean` omits the "tab = autocomplete" hint line from initial history (used by MobileTerminalSheet). `blurOnCommand?: boolean` calls `inputRef.current?.blur()` after each command so the on-screen keyboard auto-dismisses (used by MobileTerminalSheet). Both default false — desktop Terminal behavior unchanged.
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
- **Listing-page cards use `SectionCard`** (`src/components/sections/SectionCard.tsx`) — one shared structure for `/games`, `/writing/tech-articles`, and any future index page: eyebrow + right-aligned meta, title, uppercase tagline, description, dim facets line, CTA. Mobile-first (`p-5 sm:p-7`, `clamp()` title, wrapping meta row, 38px min CTA target). Do not hand-roll another card; add props to this one.
- **Guest design language**: the ArcZero card passes a `CardTheme` to `SectionCard` so it keeps ArcZero's own tokens (`#44aaff`, Courier New, `rgba(10,10,15,0.92)` background, `rgba(68,170,255,0.4)` border) — NOT the site's phosphor palette. This is by design: the card announces ArcZero's identity. Share the *structure*, never flatten the palette to site tokens.
- **Listing-page header lines are `text-sm`** (`> games/`, `> tech-articles/` …), matching the welcome page and `NowContent`. Keep new index pages on the same scale.
- **Essay pages**: use `EssayContent.tsx` as the shared wrapper (`title`, `subtitle`, `currentLang`, `alternateLangPath`, `readTime`, `wordCount`, `lastUpdated`, `children`). English title: `text-xl tracking-[0.15em] uppercase`. Bengali title: `text-xl tracking-[0.1em]` (no uppercase — Bangla has no case). Both have `text-foreground/45` subtitle, no `>` prefix marker.
- **Bengali font**: `[lang="bn"]` rule in `src/index.css` sets Noto Sans Bengali weight 500, `letter-spacing: 0.02em`, `line-height: 1.9`. The `lang="bn"` attribute is set on the `EssayContent` root div when `currentLang === 'bn'`. Do not set inline font styles in components.
- **MatrixBackground opacity**: component accepts `opacity?: number` prop (default: internal 0.25). `Editor.tsx` passes `opacity={0.08}` on `writing/*` routes. Prefix check is `currentSection?.startsWith('writing')` — no trailing slash (matches `writing`, `writing-essays-*`, etc.).
- **Terminal auto-collapse**: `ResponsiveLayout` owns `isTerminalFocused` state. Reading pages (`writing/*`): collapsed = 72px, others: collapsed = 132px. Expanded = 288px. Transitions 200ms ease-out. Click-outside (`data-terminal-region` attribute) and Escape key both collapse. Do NOT persist to localStorage. Terminal input row is a standalone `shrink-0` element between header and history — always visible in collapsed state.
- **404 sentinel**: unmatched React Router routes render `<Index forceSection="404" />`. `Editor.tsx` maps `"404"` → `<NotFoundContent />` and uses `useLocation()` to display `location.pathname + ".404"` in the file header. Do NOT use the legacy `NotFound.tsx` page for new 404 handling.
- **vercel.json rewrite order**: ArcZero proxy rewrites must come BEFORE the SPA fallback `/(.*) → /index.html`. First match wins. Never move the SPA fallback above the game rewrites.
- **vercel.json www redirect**: `redirects` array contains a host-conditional 301 redirect: `www.niruddeshjatra.space/(.*)` → `https://niruddeshjatra.space/$1`. Redirects run before rewrites in Vercel. The redirect must stay in `redirects`, not `rewrites`. Canonical is always the apex domain (no www).
- **Article system** (`src/articles/`): "The Paper Oscilloscope" — warm aged-paper design, outside `ResponsiveLayout`. Pages (`ArticlePage.tsx`, `ArticleHub.tsx`) are standalone with own `LanguageProvider` + `TermProvider`. Never import dc-runtime, DCLogic, sc-if/sc-for, {{holes}}, or support.js — all widgets are plain React.
- **Flow/schematic art uses `<Diagram>`, never a bare `<pre>`** (`src/articles/primitives/Diagram.tsx`). `.article-root pre` paints a dark well, which is right for code listings and wrong for a diagram sitting on paper — `Diagram` overrides `background`/`border` to transparent and adds a ruled mono label plus an optional bilingual caption. Pass the ASCII art via the `art` prop; hoist it to a module-level `ART_*` const so the BN and EN branches share one copy.
- **`src/articles/data/memoryLayers.ts` carries no capacity or cycle figures** — it is the shared layer list behind `MemoryPyramid`, `LatencyScale` and `MemoryLookupCascade`. Sizes, cycle counts and cache topology vary by architecture, so each layer holds only its role text plus an illustrative "if the nearest access took 1 second" distance. `LOOKUP_LAYERS` (L1→RAM) is what a memory-operand lookup walks: there is no register check before a cache lookup, and storage sits behind the virtual-memory system, not behind a cache miss. Do not re-add spec numbers here or in article 05's prose.
- **`src/articles/series-01/*.md` mirrors the article components** — full prose for both languages, BN block then `---`/`---` then EN, with `**[DIAGRAM · …]**`, `**[WIDGET · …]**` and `**[DEEPER · …]**` markers standing in for the rendered blocks, and a closing `Hover terms used` line listing the `Term` ids. Edit the `.tsx` and the `.md` in the same change; a condensed summary is not a mirror — three mirrors had silently drifted into summaries.
- **Articles teach the principle, not a spec sheet** — no fixed cycle counts, cache sizes, latency tables, scheduler time slices or end-to-end millisecond budgets, and no vendor-specific pipeline presented as universal. Implementation-dependent facts get hedged in the prose *and* in the widget that displays them (see the `memoryLayers.ts` note). Where a simplification is kept for teaching, the article says so — "a simplified mental model", "illustrative".
- **Term ids must exist in `glossary.ts`** — `Term` renders its child with a dashed underline whether or not the id resolves, so a typo or a deleted entry yields a hover that opens nothing and no build error. After removing a glossary entry, grep `Term id="…"` across `src/articles/content/`.
- **Inline code in article prose is a plain `<code>`** — `article.css` styles `.article-root article p code` / `li code` (Departure Mono, paper chip, `white-space: nowrap`). Do not hand-roll a mono `<span>` for this.
- **`firePortal()` singleton** — module-level function in `useLoader.ts`. Call from any component (including article pages) to imperatively trigger the portal animation before navigation. `ARTICLE_SECTIONS` set in `Index.tsx` routes sidebar clicks for `writing/tech-articles/series-01`, `writing/the-machine-beneath-your-code`, `writing/whats-inside-a-bit`, `writing/how-does-anything-become-bits`, `writing/cpu-blueprint`, `writing/heartbeat-fde`, `writing/memory-hierarchy`, `writing/os-grand-conductor`, `writing/code-to-machine-code`, `writing/from-keypress-to-screen` through `firePortal` instead of `startViewTransition`. A new published article must be added to this set (plus `FileExplorer.files`, `sections.ts` `SECTION_ALIASES`, and the `techArticles` list in `WritingContent.tsx`) or its sidebar/writing-index links silently 404 into the SPA shell instead of navigating.
- **Manifest slugs/titles are placeholders until published** — the original 8-part roadmap slugs in `manifest.ts` (`the-city-of-memory`, etc.) are provisional. When an article is actually written, its slug/title/sub often diverge from the placeholder to match what got written (e.g. `the-city-of-memory` → `memory-hierarchy`, `how-do-gates-do-arithmetic` → `cpu-blueprint`). Renaming the slug on publish is expected — just update every cross-link (routes.mjs, App.tsx, ArticlePage.tsx, FileExplorer.tsx, sections.ts, SeriesHub.tsx, WritingContent.tsx, Index.tsx, and the previous article's `RelayNav` `next.href`) in the same change.
- **Two-level tech-articles structure** — `/writing/tech-articles` is a *landing page* listing every series, rendered inside the terminal shell (`TechArticlesContent.tsx`, wired in `Editor.tsx` like `GamesContent`); it does **not** fire the portal. `/writing/tech-articles/series-01` is this series' paper-oscilloscope hub (`ArticleHub.tsx` -> `SeriesHub.tsx`), a standalone page outside `ResponsiveLayout`, and it **does** fire the portal. The "Entering the tech world" animation therefore only plays when crossing into a series or an article, never when opening the plain listing. Adding SERIES 002 means: a new card in `TechArticlesContent`, a `series-02` route, and a new sidebar subfolder under `tech-articles/`.
- **Series paths are constants, not literals** — `TECH_ARTICLES_PATH` and `SERIES_HUB_PATH` live in `src/articles/manifest.ts`. `RelayNav.tsx` additionally exports `SERIES_HUB_CARD`, the identical back-to-hub card that all nine articles render; articles do `hub={SERIES_HUB_CARD}` instead of repeating the literal. Never hardcode `/writing/tech-articles...` in an article or page.
- **`SeriesHub.tsx` derives its rows from `ARTICLES`** (manifest) rather than keeping a hand-written copy — titles, subs, hrefs, `state`, the `N/8 read` counter, and the ongoing/complete chip all come from the manifest. The old duplicated array silently went stale twice (legs 06 and 07 stayed `next`/`#` after publishing). Publishing an article now only requires flipping its manifest entry to `state: 'read'`.
- **Reader progress is client-side state** — `src/articles/hooks/useReadProgress.ts` stores opened article slugs in `localStorage` under `ncs_articles_read`. `ArticlePage` calls `markArticleRead(slug)` on mount; `SeriesHub` colours its signal map and station list from it (read / read-next / unread / soon) and shows a reset control. The hook starts empty on first render and fills in via `useEffect`, so the prerendered HTML and the hydrated client agree — never read `localStorage` during render in an article component.
- **`PromptBar`'s `readCount`** (series progress dots) is derived in `ArticlePage.tsx` as `ARTICLES.filter(a => a.state === 'read').length` — never hardcode this number; it must track how many articles are actually published.
- **Article design tokens**: paper bg `#e8dfc9`; ink `#26241C`; ink-green `#00753F` (on paper only); phosphor `#00d26a` (inside dark scope wells only — never on paper). Tokens in `tailwind.config.ts` under `paper`, `ink`, `rule`, `machine`, `well`.
- **Bilingual articles**: BN default; JS toggle (no URL change). BN numerals via `bd()` helper in BN mode. `lang="bn"` on BN blocks. Definitions follow the toggle. SEO uses `<Helmet>` inside `ArticleBody` (which has `useLang()` context) so title/description/`<html lang>` update dynamically.
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

## SEO
Crawlers (Facebook/LinkedIn/WhatsApp/Twitter scrapers) do not execute JS — every route's meta must be present in the **static HTML served for that route**, not injected client-side only. This is achieved by prerendering (below); `<SEO>` is still required because it's what the prerender crawl captures.

- **Site identity constants**: `src/lib/site.ts` exports `SITE_URL`/`SITE_NAME`/`SITE_AUTHOR` — the single source for the domain. Import this instead of re-declaring a local `const SITE_URL = '...'`; `SEO.tsx`, `structuredData.ts`, `ArticlePage.tsx`, `ArticleHub.tsx`, and the `generate-og`/`generate-sitemap` build scripts all import from it.
- **SEO component**: `src/components/SEO.tsx` — wraps `react-helmet-async`. Every routed page must render one `<SEO>` with `title`, `description`, `path`, `lang`, `ogType`, and (for articles) `structuredData`. Emits title, meta description, canonical, hreflang alternates, full OG set (including `og:locale`/`og:locale:alternate`), Twitter card, and optional per-page `image` override.
- **Structured data**: `src/lib/structuredData.ts` exports `websiteSchema()`, `personSchema()`, `articleSchema({ title, description, path, datePublished, dateModified?, lang, image?, isPartOf? })`. Pass the result as `<SEO structuredData={...}>`.
- **Adding a new article REQUIRES, in `src/articles/manifest.ts`** (single source of truth — never hardcode a second title/description copy in the page component):
  1. `enTitle`/`bnTitle` (already required)
  2. `enDescription`/`bnDescription` — meta description, both languages
  3. `datePublished` (`YYYY-MM-DD`)
  4. Add the route to `scripts/routes.mjs` (`ROUTES` array) — this is what gets prerendered *and* what feeds `sitemap.xml`/hreflang generation. Missing this = the article silently has no crawler-visible meta and isn't in the sitemap.
  `ArticleEntry` in `manifest.ts` is a discriminated union on `state`: any entry with `state: 'read'` (`PublishedArticleEntry`) requires `enDescription`/`bnDescription`/`datePublished` at **compile time** — `tsc` fails the build if you mark an article `'read'` without them, not just at render. `ArticlePage.tsx`'s `getArticleMeta()` still has a runtime check for the string-keyed manifest lookup (TS can't narrow that statically), as a fallback.
- **New page/section (non-article) REQUIRES**: an `<SEO>` block in the section component (see `WritingContent.tsx` for the pattern) and an entry in `scripts/routes.mjs`.
- **OG images are build-generated — no manual step**: `scripts/generate-og.mjs` (run via `npm run generate-og`, part of `npm run build`) renders `public/og-image.png` (site-wide) plus one 1200×630 `public/og/<slug>.png` per published article + the hub (`public/og/tech-articles.png`), using the Paper Oscilloscope palette and titles pulled from `manifest.ts`. A new published article picks up an image automatically — nothing to generate by hand. The script imports `.ts` modules (`manifest.ts`, `site.ts`) so it runs via `tsx`, not plain `node`.
- **Sitemap/robots are build-generated — no manual step**: `scripts/generate-sitemap.mjs` (`npm run generate-sitemap`, part of `npm run build`, runs via `tsx`) writes `public/sitemap.xml` and `public/robots.txt` from `scripts/routes.mjs`. Each `ROUTES` entry explicitly carries its own `priority`/`changefreq`, and bilingual pages carry an explicit `alternate: { lang, path }` pointer to their sibling-language route — hreflang pairing is config, not inferred from a `-bn` suffix. A new bilingual essay must set `alternate` on both of its `ROUTES` entries. Do not hand-edit `sitemap.xml`/`robots.txt`, edits get overwritten on next build.
- **Prerender**: runs as `postbuild` via `scripts/prerender.mjs`, crawling every path in `ROUTE_PATHS` (from `scripts/routes.mjs`) with headless Chrome and writing the post-Helmet HTML to `dist/<route>/index.html`. Browser resolution order: `CHROME_PATH` env var → local desktop Chrome (dev) → `@sparticuz/chromium` (bundled serverless-compatible binary, used on Vercel's build). If no browser resolves: **fails the build** when `CI`/`VERCEL` env vars are set (prevents silently shipping meta-less HTML again — this was the original bug), otherwise warns and skips (local dev convenience).
- **`@vitejs/plugin-legacy` spread**: `vite.config.ts` uses `...legacy({})` (spread). This is intentional — the plugin returns `Plugin[]`, so spread is required. Do not remove the spread.
- **Verify after any SEO-relevant change**: `npm run build`, then for each changed route: `grep -o '<meta property="og:[^>]*>' dist/<route>/index.html` — confirm unique `og:title`/`og:description`/`og:image` per route, none falling back to the generic site-wide title.

## Commands
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Production build (generates OG image, favicons, vite build, then prerenders)
npm run preview      # Preview production build
npm run lint         # ESLint check
npx tsc --noEmit     # Type check
npx vitest           # Run unit tests
npx playwright test  # Run E2E tests
CHROME_PATH=/path/to/chrome npm run prerender  # Run prerender manually
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
