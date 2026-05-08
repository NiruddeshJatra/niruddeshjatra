import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MIN_TOUCH_TARGET_SIZE } from '../utils/accessibility';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: KeyboardShortcut[] = [
  // Navigation shortcuts
  { keys: ['Ctrl', 'M'], description: 'Toggle mobile navigation menu', category: 'Navigation' },
  { keys: ['Ctrl', 'T'], description: 'Toggle terminal (mobile)', category: 'Navigation' },
  { keys: ['Escape'], description: 'Close navigation menu or terminal', category: 'Navigation' },
  
  // Section shortcuts
  { keys: ['Ctrl', '1'], description: 'Go to About section', category: 'Sections' },
  { keys: ['Ctrl', '2'], description: 'Go to Experience section', category: 'Sections' },
  { keys: ['Ctrl', '3'], description: 'Go to Projects section', category: 'Sections' },
  { keys: ['Ctrl', '4'], description: 'Go to Skills section', category: 'Sections' },
  { keys: ['Ctrl', '5'], description: 'Go to Education section', category: 'Sections' },
  { keys: ['Ctrl', '6'], description: 'Go to Blog section', category: 'Sections' },
  { keys: ['Ctrl', '7'], description: 'Go to Contact section', category: 'Sections' },
  
  // List navigation
  { keys: ['↑', '↓'], description: 'Navigate through file list', category: 'List Navigation' },
  { keys: ['Home'], description: 'Go to first item in list', category: 'List Navigation' },
  { keys: ['End'], description: 'Go to last item in list', category: 'List Navigation' },
  { keys: ['Enter', 'Space'], description: 'Activate selected item', category: 'List Navigation' },
  
  // General
  { keys: ['Tab'], description: 'Move to next focusable element', category: 'General' },
  { keys: ['Shift', 'Tab'], description: 'Move to previous focusable element', category: 'General' },
  { keys: ['Ctrl', '?'], description: 'Show/hide keyboard shortcuts', category: 'General' },
];

const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle keyboard shortcuts for the help dialog
  useKeyboardNavigation({
    onEscape: () => {
      if (isOpen) {
        setIsOpen(false);
      }
    },
    enabled: isOpen
  });

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const renderKeyCombo = (keys: string[]) => (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-muted-foreground">+</span>}
          <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-4 right-4 p-3 bg-primary text-primary-foreground rounded-full
          shadow-lg hover:shadow-xl transition-all duration-200 z-40
          focus-visible:focus-visible min-h-[${MIN_TOUCH_TARGET_SIZE}px] min-w-[${MIN_TOUCH_TARGET_SIZE}px]
          flex items-center justify-center
        `}
        aria-label="Show keyboard shortcuts help"
        title="Keyboard shortcuts (Ctrl + ?)"
      >
        <Keyboard className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Help dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="bg-background border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 id="shortcuts-title" className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-phosphor" aria-hidden="true" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`
                  p-2 rounded-md hover:bg-muted/50 focus-visible:focus-visible transition-colors
                  min-h-[${MIN_TOUCH_TARGET_SIZE}px] min-w-[${MIN_TOUCH_TARGET_SIZE}px]
                  flex items-center justify-center
                `}
                aria-label="Close keyboard shortcuts help"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={`${category}-${index}`}
                        className="flex items-center justify-between py-2 px-3 rounded bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-sm text-foreground">
                          {shortcut.description}
                        </span>
                        {renderKeyCombo(shortcut.keys)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/10">
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> to close this dialog
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelp;