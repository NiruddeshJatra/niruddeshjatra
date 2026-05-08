import { useEffect, useState, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FolderOpen, FlaskConical, BookOpen, User, Search } from 'lucide-react';
import Editor from './Editor';

const LazyCommandPalette = lazy(() => import('./CommandPalette'));

interface MobileShellProps {
  onThemeChange?: (theme: { name: string; bg: string; accent: string }) => void;
}

const pathToSection = (pathname: string): string => {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');
  return trimmed === '' ? 'welcome' : trimmed;
};

const STATUS_MESSAGES = ['press / to search', 'type help in terminal', 'tap a section below'];

const NAV_ITEMS = [
  { label: 'Files', section: 'about', icon: FolderOpen },
  { label: 'Lab', section: 'lab', icon: FlaskConical },
  { label: 'Blog', section: 'blog', icon: BookOpen },
  { label: 'About', section: 'about', icon: User },
] as const;

const MobileShell = ({ onThemeChange }: MobileShellProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection = pathToSection(location.pathname);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  // Cycle status strip message
  useEffect(() => {
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 3000);
    return () => clearInterval(id);
  }, []);

  // `/` shortcut opens palette
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const goTo = (section: string) => {
    navigate(section === 'welcome' ? '/' : `/${section}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-black/80 backdrop-blur-sm shrink-0">
        <button
          onClick={() => goTo('welcome')}
          className="text-xs font-mono font-semibold text-phosphor"
          aria-label="Go to home"
        >
          nasif.space
        </button>
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border/50 hover:border-border"
          aria-label="Open search"
        >
          <Search className="w-3 h-3" />
          <span className="font-mono">/</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden" id="main-content">
        <Editor currentSection={currentSection} />
      </main>

      {/* Bottom nav */}
      <nav
        className="shrink-0 border-t border-border bg-black/90 backdrop-blur-sm"
        aria-label="Main navigation"
      >
        <ul className="flex" role="menubar">
          {NAV_ITEMS.map(({ label, section, icon: Icon }) => {
            const isActive = currentSection === section;
            return (
              <li key={label} className="flex-1" role="none">
                <button
                  onClick={() => goTo(section)}
                  className={`w-full flex flex-col items-center gap-1 py-2 text-[10px] font-mono transition-colors
                    ${isActive ? 'text-phosphor' : 'text-muted-foreground hover:text-foreground'}`}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status strip */}
      <div
        className="shrink-0 px-4 py-1 bg-black/60 font-mono text-[10px] text-muted-foreground/60 text-center"
        role="status"
        aria-live="polite"
      >
        $ {STATUS_MESSAGES[statusIdx]}
      </div>

      {/* Command palette */}
      <Suspense fallback={null}>
        <LazyCommandPalette
          isOpen={isPaletteOpen}
          mode="files"
          onClose={() => setIsPaletteOpen(false)}
          onThemeChange={onThemeChange}
        />
      </Suspense>
    </div>
  );
};

export default MobileShell;
