import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useGlobalKeyboardShortcuts } from '../hooks/useKeyboardNavigation';
import { getLayoutClasses, Z_INDEX } from '../utils/responsive';
import { getLayoutChangeAria, announceToScreenReader } from '../utils/accessibility';
import FileExplorer, { files } from './FileExplorer';
import Editor from './Editor';
import ResponsiveHeader from './ResponsiveHeader';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import StatusBar from './StatusBar';
import { LazyTerminal, ConditionalLazy } from './LazyComponents';
import MobileFileDrawer from './MobileFileDrawer';
import MobileTerminalSheet from './MobileTerminalSheet';
import { MemoryManager } from '@/utils/memoryOptimization';
import { LayoutMode } from '../hooks/useViewport';
import { useCommandPalette } from '../hooks/useCommandPalette';

const LazyCommandPalette = lazy(() => import('./CommandPalette'));

interface Theme {
  name: string;
  bg: string;
  accent: string;
}

interface ResponsiveLayoutProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  currentSection,
  onSectionChange,
  theme,
  onThemeChange
}) => {
  const { viewport, navigationState, actions } = useResponsiveLayout();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTerminalFocused, setIsTerminalFocused] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Memory optimization - register cleanup tasks
  useEffect(() => {
    const cleanup = () => {
      setIsTransitioning(false);
    };

    MemoryManager.addCleanupTask(cleanup);

    return () => {
      MemoryManager.removeCleanupTask(cleanup);
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle section changes with smooth transitions
  const handleSectionChange = useCallback((section: string) => {
    setIsTransitioning(true);

    if (navigationState.isMobileMenuOpen) {
      actions.closeMobileMenu();
    }

    const fileName = files.find(f => f.section === section)?.name || section;
    announceToScreenReader(`Loading ${fileName}`, 'polite');

    const duration = viewport.isMobile ? 150 : 200;

    if (transitionTimeoutRef.current !== null) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      transitionTimeoutRef.current = null;
      onSectionChange(section);
      setIsTransitioning(false);
      announceToScreenReader(`${fileName} loaded`, 'polite');
    }, duration);
  }, [onSectionChange, navigationState.isMobileMenuOpen, actions, viewport.isMobile]);

  const handleCommand = useCallback((command: string) => {
    handleSectionChange(command);
  }, [handleSectionChange]);

  // Auto-close mobile menu when switching to desktop
  useEffect(() => {
    if (viewport.isDesktop && navigationState.isMobileMenuOpen) {
      actions.closeMobileMenu();
    }
  }, [viewport.isDesktop, navigationState.isMobileMenuOpen, actions]);

  // Click-outside collapses terminal (desktop only — skip on mobile)
  useEffect(() => {
    if (viewport.isMobile) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-terminal-region]')) {
        setIsTerminalFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [viewport.isMobile]);

  const isReadingPage = currentSection?.startsWith('writing/');
  const collapsedHeight = isReadingPage ? 72 : 132;
  const terminalHeight = isTerminalFocused ? 288 : collapsedHeight;

  const layoutClasses = getLayoutClasses(navigationState.currentLayout);

  const layoutModeNames = {
    [LayoutMode.SINGLE_PANEL]: 'mobile',
    [LayoutMode.DUAL_PANEL]: 'tablet',
    [LayoutMode.THREE_PANEL]: 'desktop'
  };

  const currentLayoutName = layoutModeNames[navigationState.currentLayout] || 'unknown';
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const palette = useCommandPalette();

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts({
    'escape': () => {
      if (showKeyboardHelp) {
        setShowKeyboardHelp(false);
      } else if (navigationState.isMobileMenuOpen) {
        actions.closeMobileMenu();
        announceToScreenReader('Navigation menu closed', 'polite');
      }
    },
    'ctrl+?': () => {
      if (!viewport.isMobile) {
        setShowKeyboardHelp(!showKeyboardHelp);
        announceToScreenReader(
          showKeyboardHelp ? 'Keyboard shortcuts help closed' : 'Keyboard shortcuts help opened',
          'polite'
        );
      }
    },
    'ctrl+m': () => {
      if (viewport.isMobile) {
        actions.toggleMobileMenu();
        const message = navigationState.isMobileMenuOpen
          ? 'Navigation menu closed'
          : 'Navigation menu opened';
        announceToScreenReader(message, 'polite');
      }
    },
    'ctrl+1': () => handleSectionChange('about'),
    'ctrl+2': () => handleSectionChange('blog'),
    'ctrl+3': () => handleSectionChange('now'),
    'ctrl+4': () => handleSectionChange('contact'),
    'ctrl+5': () => handleSectionChange('games'),
    'ctrl+6': () => handleSectionChange('writing'),
    'ctrl+7': () => handleSectionChange('journey'),
    'meta+p': () => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      palette.open('files');
    },
    'meta+shift+p': () => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      palette.open('commands');
    },
  });

  // Mobile layout
  if (viewport.isMobile) {
    return (
      <div
        className="flex flex-col h-screen overflow-hidden"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => navigate('/')}
            className="text-sm font-mono font-semibold text-phosphor tracking-wide"
            aria-label="Go to home"
            type="button"
          >
            niruddeshjatra
          </button>
          <button
            onClick={() => actions.toggleMobileMenu()}
            className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Open file menu"
            type="button"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Off-canvas file drawer */}
        <MobileFileDrawer
          isOpen={navigationState.isMobileMenuOpen}
          onClose={actions.closeMobileMenu}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {/* Main content — pb-11 clears the collapsed terminal bar */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-11"
          role="main"
          aria-label="Portfolio content"
        >
          <div
            className={`
              transition-all duration-150 ease-out
              ${isTransitioning ? 'opacity-0' : 'opacity-100'}
            `}
            aria-busy={isTransitioning}
            aria-live="polite"
          >
            <Editor currentSection={currentSection} />
          </div>
        </main>

        {/* Terminal slide-up sheet */}
        <MobileTerminalSheet
          currentSection={currentSection}
          onCommand={handleCommand}
          onThemeChange={onThemeChange}
        />

        {/* Command Palette */}
        <Suspense fallback={null}>
          <LazyCommandPalette
            isOpen={palette.isOpen}
            mode={palette.mode}
            onClose={palette.close}
            onThemeChange={onThemeChange}
          />
        </Suspense>
      </div>
    );
  }

  // Desktop / tablet layout (unchanged)
  return (
    <div
      className={`${layoutClasses} overflow-hidden transition-colors duration-300`}
      style={{ backgroundColor: theme.bg }}
      {...getLayoutChangeAria(currentLayoutName, isTransitioning)}
    >
      {/* Responsive Header */}
      <ResponsiveHeader
        onMenuToggle={actions.toggleMobileMenu}
        currentSection={currentSection}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative" style={{ zIndex: Z_INDEX.content }}>
        {/* File Explorer - Desktop/Tablet Layout */}
        {navigationState.currentLayout !== LayoutMode.SINGLE_PANEL && (
          <div className="shrink-0">
            <FileExplorer
              currentSection={currentSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        )}

        {/* Editor - Main Content */}
        <main
          id="main-content"
          className="flex-1 relative"
          style={{
            willChange: isTransitioning ? 'transform, opacity' : 'auto'
          }}
          role="main"
          aria-label="Portfolio content"
        >
          <div
            className={`
              absolute inset-0 transition-all duration-200 ease-out
              ${isTransitioning ? 'opacity-0' : 'opacity-100'}
            `}
            style={{
              transform: isTransitioning
                ? 'translate3d(0, 8px, 0) scale(0.98)'
                : 'translate3d(0, 0, 0) scale(1)',
              filter: isTransitioning ? 'blur(2px)' : 'blur(0px)'
            }}
            aria-busy={isTransitioning}
            aria-live="polite"
          >
            <Editor currentSection={currentSection} />
          </div>
        </main>
      </div>

      {/* Terminal - Desktop fixed-height panel */}
      <div
        data-terminal-region
        className="border-t border-border relative transition-all duration-200 ease-out overflow-hidden"
        style={{ height: terminalHeight, zIndex: Z_INDEX.terminal }}
      >
        <ConditionalLazy
          fallback={
            <div className="h-full flex items-center justify-center">
              <span className="text-green-400 font-mono">Loading terminal...</span>
            </div>
          }
        >
          <LazyTerminal
            onCommand={handleCommand}
            currentSection={currentSection}
            onThemeChange={onThemeChange}
            isFocused={isTerminalFocused}
            onFocusChange={setIsTerminalFocused}
          />
        </ConditionalLazy>
      </div>

      {/* Status Bar */}
      <StatusBar currentSection={currentSection} />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Command Palette */}
      <Suspense fallback={null}>
        <LazyCommandPalette
          isOpen={palette.isOpen}
          mode={palette.mode}
          onClose={palette.close}
          onThemeChange={onThemeChange}
        />
      </Suspense>
    </div>
  );
};

export default ResponsiveLayout;
