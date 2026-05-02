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
│   ├── sections/         # Page content sections (About, Projects, Skills, etc.)
│   ├── ui/               # shadcn/ui primitives
│   ├── Editor.tsx        # Main VS Code-style editor pane; per-section skeleton fallbacks
│   ├── FileExplorer.tsx  # Sidebar file tree — authoritative `files` array + hierarchy
│   ├── Terminal.tsx      # Interactive terminal component
│   ├── ResponsiveLayout.tsx  # Root layout — gates MobileShell at < 768px
│   ├── MobileShell.tsx   # Mobile-only layout (top bar + editor + bottom nav)
│   ├── CommandPalette.tsx    # Cmd+P / Cmd+Shift+P palette (cmdk, lazy-loaded)
│   ├── ResponsiveHeader.tsx  # Top nav / menu bar
│   ├── StatusBar.tsx     # Bottom VS Code status bar
│   ├── ThemeSwitcher.tsx # Dark/light/system theme toggle
│   └── MatrixBackground.tsx  # Animated matrix background (density 0.6, 50ms frame)
├── pages/
│   ├── Index.tsx         # Home page
│   └── NotFound.tsx      # 404
├── hooks/
│   ├── useCommandPalette.ts  # Palette open/mode state
│   └── ...               # Other custom hooks
├── lib/                  # Shared utilities
└── constants/
    ├── sections.ts       # SECTION_ALIASES — derived from FileExplorer.files (skips containers)
    └── ...               # Other static data
```

## Sidebar File Tree

Canonical folder structure in `FileExplorer.files`:
```
me/           → container (expand/collapse, no section)
  about.txt   → about
  experience.txt → experience
  education.txt  → education
  skills.json    → skills
work/         → container
  projects.txt   → projects
  lab/           → lab
writing/      → container
  blog.md        → blog
  notes/         → notes
now.md        → now
contact.md    → contact
colophon.md   → colophon
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

## Key Conventions
- Functional components + hooks only — no class components
- Tailwind CSS for all styling — no inline styles, no CSS modules
- shadcn/ui for UI primitives — add via `npx shadcn-ui@latest add <component>`
- Named exports for components; default export for pages
- No `any` types — proper TypeScript interfaces required
- Project/skills data lives in `src/constants/` — never hardcoded in components
- **Section aliases** live in `src/constants/sections.ts`, derived from `FileExplorer.files` — never duplicate this map in components. Skips items where `section === ''` (container folders).
- **Mobile layout**: `ResponsiveLayout` gates `<MobileShell>` when `viewport.isMobile` (< 768px) — the desktop IDE chrome must NOT render on mobile
- **CommandPalette** is lazy-loaded; `meta+p` = files, `meta+shift+p` = commands; always guard against `HTMLInputElement` focus before opening
- **FileExplorer owns its width** — do NOT set `w-*` on the wrapper div in `ResponsiveLayout`. Collapsed = `w-8`, expanded = `w-48`, managed internally.
- **Lazy section loading** — all sections in `Editor.tsx` are `React.lazy`. Each has a dedicated skeleton fallback (see `getSectionSkeleton`). Do not use generic "loading..." text.
- **Section page design**: code-as-self style — monospace, comment blocks, `const` objects. No generic resume bullet points. `max-w-xl mx-auto` for short-form sections; `max-w-2xl` only for prose pages (DraftAbout, future blog).
- **Color system — phosphor palette**: use `text-phosphor` (accent/markers), `text-phosphor-soft` (string values), `text-phosphor-dim` (comments, metadata), `text-danger` (errors). `terminal-{cyan,purple,yellow,orange,blue,green}` classes are **retired** — do not use. Note: `FileExplorer`, `MobileShell`, `ResponsiveHeader`, `CommandPalette` still use `terminal-*` pending Phase C2.
- **Font**: Departure Mono is primary (`public/fonts/DepartureMono-Regular.woff2`). JetBrains Mono is fallback. Both declared in `tailwind.config.ts` `fontFamily.mono`.
- **File-signature footer**: completed section components end with `— nj · YYYY-MM · N bytes` in `text-phosphor-dim`. Byte counts are hardcoded per section — see each component.
- **Terminal output**: ASCII markers only — `>` for nav/status, `!` for errors, `ok ·` for success, `•` for lists. No emoji in `Terminal.tsx` output strings.
- Commit format: `type(scope): description` (feat/fix/chore/refactor/docs)

## localStorage Keys
All keys namespaced `ncs_*` to avoid collisions:
| Key | Type | Purpose |
|-----|------|---------|
| `ncs_sidebar_collapsed` | `"true" \| "false"` | FileExplorer collapsed state |
| `ncs_folders_expanded` | `JSON string[]` | Set of expanded container folder ids |

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
