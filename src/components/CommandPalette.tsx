import { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { files } from './FileExplorer';
import type { PaletteMode } from '../hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen: boolean;
  mode: PaletteMode;
  onClose: () => void;
  onThemeChange?: (theme: { name: string; bg: string; accent: string }) => void;
}

interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

const CommandPalette = ({ isOpen, mode, onClose, onThemeChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const goToSection = (section: string) => {
    navigate(section === 'welcome' ? '/' : `/${section}`);
    onClose();
  };

  const fileItems: PaletteItem[] = files.map((f) => ({
    id: f.section,
    label: f.name,
    hint: `open ${f.section}`,
    action: () => goToSection(f.section),
  }));

  const commandItems: PaletteItem[] = [
    {
      id: 'theme-dark',
      label: 'theme dark',
      hint: 'switch to dark matrix theme',
      action: () => {
        onThemeChange?.({ name: 'matrix', bg: '#0d0d0d', accent: '#00ff00' });
        onClose();
      },
    },
    {
      id: 'open-resume',
      label: 'open /resume',
      hint: 'download resume PDF',
      action: () => {
        window.open('/resume.pdf', '_blank');
        onClose();
      },
    },
    {
      id: 'cd-root',
      label: 'cd /',
      hint: 'go to home',
      action: () => goToSection('welcome'),
    },
  ];

  const allItems = mode === 'commands' ? [...fileItems, ...commandItems] : fileItems;

  const filtered = query
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.hint?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : allItems;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      style={{ height: '100dvh' }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'commands' ? 'Command palette' : 'Quick open'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-border rounded-lg shadow-2xl overflow-hidden">
        <Command
          className="flex flex-col"
          shouldFilter={false}
          aria-label={mode === 'commands' ? 'Command palette' : 'Quick open'}
        >
          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground font-mono text-phosphor select-none">
              {mode === 'commands' ? '>' : '$'}
            </span>
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={mode === 'commands' ? 'Type a command…' : 'Go to file…'}
              className="flex-1 bg-transparent outline-none text-sm font-mono text-foreground placeholder:text-muted-foreground/50"
              aria-expanded={isOpen}
              aria-autocomplete="list"
            />
            <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1 py-0.5 font-mono">
              esc
            </kbd>
          </div>

          {/* List */}
          <Command.List className="max-h-72 overflow-y-auto custom-scrollbar py-1">
            {filtered.length === 0 && (
              <Command.Empty className="py-6 text-center text-xs text-muted-foreground font-mono">
                No results for "{query}"
              </Command.Empty>
            )}
            {filtered.length > 0 && (
              <Command.Group>
                {filtered.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    onSelect={item.action}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-mono cursor-pointer
                      aria-selected:bg-muted aria-selected:text-foreground
                      text-muted-foreground hover:bg-muted/50 hover:text-foreground
                      transition-colors"
                  >
                    <span className="text-phosphor select-none">→</span>
                    <span className="flex-1 text-foreground">{item.label}</span>
                    {item.hint && (
                      <span className="text-xs text-muted-foreground/60">{item.hint}</span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer hint */}
          <div className="px-3 py-1.5 border-t border-border flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            <span><kbd className="border border-border rounded px-1">↑↓</kbd> navigate</span>
            <span><kbd className="border border-border rounded px-1">↵</kbd> open</span>
            <span><kbd className="border border-border rounded px-1">esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  );
};

export default CommandPalette;
