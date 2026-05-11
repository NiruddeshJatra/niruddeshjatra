import { useRef, useState, useEffect } from "react";
import { Folder, File, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { useListKeyboardNavigation } from '../hooks/useKeyboardNavigation';

export interface FileItem {
  id?: string;
  name: string;
  section: string;
  icon: typeof File;
  parent?: string;
  isContainer?: boolean;
}

interface FileExplorerProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const files: FileItem[] = [
  { id: 'me', name: 'me/', section: '', icon: Folder, isContainer: true },
  { name: 'about.md', section: 'about', icon: File, parent: 'me' },
  { name: 'games/', section: 'games', icon: Folder },
  { id: 'writing', name: 'writing/', section: 'writing', icon: Folder, isContainer: true },
  { id: 'writing-essays', name: 'essays/', section: '', icon: Folder, isContainer: true, parent: 'writing' },
  { name: 'on-running-for-nothing.md', section: 'writing-essays-on-running-for-nothing', icon: File, parent: 'writing-essays' },
  { id: 'writing-tech-articles', name: 'tech-articles/', section: '', icon: Folder, isContainer: true, parent: 'writing' },
  { id: 'journey', name: 'journey/', section: 'journey', icon: Folder, isContainer: true },
  { name: 'running.md', section: 'journey-running', icon: File, parent: 'journey' },
  { name: 'hiking.md', section: 'journey-hiking', icon: File, parent: 'journey' },
  { name: 'field-notes/', section: 'field-notes', icon: Folder },
  { name: 'photos/', section: 'photos', icon: Folder },
  { id: 'archived', name: 'archived/', section: '', icon: Folder, isContainer: true },
  { name: 'experience.txt', section: 'archived-experience', icon: File, parent: 'archived' },
  { name: 'education.txt', section: 'archived-education', icon: File, parent: 'archived' },
  { name: 'projects.txt', section: 'archived-projects', icon: File, parent: 'archived' },
  { name: 'skills.json', section: 'archived-skills', icon: File, parent: 'archived' },
  { name: 'now.md', section: 'now', icon: File },
  { name: 'contact.md', section: 'contact', icon: File },
];

const STORAGE_KEY_COLLAPSED = 'ncs_sidebar_collapsed';
const STORAGE_KEY_EXPANDED = 'ncs_folders_expanded';

const defaultExpanded = new Set(['me', 'writing', 'journey']);

const loadExpanded = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXPANDED);
    if (raw) return new Set(JSON.parse(raw) as string[]);
  } catch {}
  return new Set(defaultExpanded);
};

const FileExplorer = ({ currentSection, onSectionChange }: FileExplorerProps) => {
  const explorerRef = useRef<HTMLElement>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true'
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(loadExpanded);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLLAPSED, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify([...expandedFolders]));
  }, [expandedFolders]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isFileVisible = (f: FileItem): boolean => {
    if (!f.parent) return true;
    if (!expandedFolders.has(f.parent)) return false;
    const parent = files.find(p => p.id === f.parent);
    return !parent || isFileVisible(parent);
  };

  const getDepth = (f: FileItem): number => {
    if (!f.parent) return 0;
    const parent = files.find(p => p.id === f.parent);
    return 1 + (parent ? getDepth(parent) : 0);
  };

  const visibleFiles = files.filter(isFileVisible);

  const getFileButtons = () => {
    if (!explorerRef.current) return [];
    return Array.from(
      explorerRef.current.querySelectorAll('[data-file-button]')
    ) as HTMLElement[];
  };

  useListKeyboardNavigation(
    getFileButtons(),
    focusedItemIndex,
    setFocusedItemIndex,
    (index) => {
      const file = visibleFiles[index];
      if (!file) return;
      if (file.isContainer && file.id) {
        toggleFolder(file.id);
      } else if (file.section) {
        onSectionChange(file.section);
      }
    },
    true
  );

  if (collapsed) {
    return (
      <nav
        ref={explorerRef}
        className="h-full flex flex-col w-8 bg-black/90 backdrop-blur-sm border-r border-border"
        aria-label="Portfolio sections"
        role="navigation"
      >
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Expand file explorer"
          type="button"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </nav>
    );
  }

  return (
    <nav
      ref={explorerRef}
      className="h-full flex flex-col w-48 bg-black/90 backdrop-blur-sm border-r border-border"
      aria-label="Portfolio sections"
      role="navigation"
    >
      <div className="border-b border-border bg-black/50">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Folder className="w-3.5 h-3.5 text-phosphor/70" aria-hidden="true" />
          <h2 className="text-[11px] font-semibold uppercase tracking-wide flex-1 text-muted-foreground">
            WORKSPACE
          </h2>
          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Collapse file explorer"
            type="button"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <ul role="menu">
          {visibleFiles.map((file, index) => {
            const isActive = currentSection === file.section && !file.isContainer;
            const isFocused = focusedItemIndex === index;
            const isExpanded = file.isContainer && file.id ? expandedFolders.has(file.id) : false;
            const depth = getDepth(file);
            const indentClass = depth === 0 ? 'pl-1' : depth === 1 ? 'pl-4' : 'pl-7';
            const Chevron = isExpanded ? ChevronDown : ChevronRight;

            if (file.isContainer) {
              return (
                <li key={file.id} role="none">
                  <button
                    data-file-button
                    onClick={() => { if (file.id) toggleFolder(file.id); if (file.section) onSectionChange(file.section); }}
                    className={`
                      w-full flex items-center gap-1 ${indentClass} pr-2 py-0.5 text-xs text-left
                      transition-colors duration-150 text-muted-foreground hover:text-foreground
                      ${isFocused ? 'ring-1 ring-primary ring-inset' : ''}
                    `}
                    aria-expanded={isExpanded}
                    type="button"
                  >
                    <Chevron className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <Folder className="w-3 h-3 shrink-0 text-phosphor/70" aria-hidden="true" />
                    <span className="truncate font-medium">{file.name}</span>
                  </button>
                </li>
              );
            }

            return (
              <li key={file.section || file.name} role="none">
                <button
                  data-file-button
                  onClick={() => file.section && onSectionChange(file.section)}
                  className={`
                    w-full flex items-center gap-1.5 ${indentClass} pr-2 py-0.5 text-xs text-left
                    transition-colors duration-150 focus-visible:focus-visible
                    ${isActive
                      ? 'bg-muted text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    }
                    ${isFocused ? 'ring-1 ring-primary ring-inset' : ''}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  role="menuitem"
                  type="button"
                >
                  <file.icon
                    className={`w-3 h-3 shrink-0 ${isActive ? 'text-phosphor' : ''}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{file.name}</span>
                  {isActive && (
                    <span className="sr-only">(current section)</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className="px-2 py-1.5 border-t border-border bg-muted/20 text-[10px] text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
          <span>Ready</span>
        </div>
      </div>
    </nav>
  );
};

export default FileExplorer;
