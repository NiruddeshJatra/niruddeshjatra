import React, { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useGlobalKeyboardShortcuts } from '../hooks/useKeyboardNavigation';
import { getLayoutClasses, Z_INDEX } from '../utils/responsive';
import { getLayoutChangeAria, announceToScreenReader } from '../utils/accessibility';
import FileExplorer, { files } from './FileExplorer';
import Editor from './Editor';
import ResponsiveHeader from './ResponsiveHeader';
import MobileNavigation from './MobileNavigation';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import StatusBar from './StatusBar';
import { LazyTerminal, LazyResponsiveTerminal, ConditionalLazy } from './LazyComponents';
import { MemoryManager } from '@/utils/memoryOptimization';
import { LayoutMode } from '../hooks/useViewport';
import { useCommandPalette } from '../hooks/useCommandPalette';
import MobileShell from './MobileShell';

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
    
    // Close mobile navigation when section changes
    if (navigationState.isMobileMenuOpen) {
      actions.closeMobileMenu();
    }
    
    // Announce section change to screen readers
    const fileName = files.find(f => f.section === section)?.name || section;
    announceToScreenReader(`Loading ${fileName}`, 'polite');
    
    // Use optimal animation duration based on device performance
    const duration = viewport.isMobile ? 150 : 200;

    if (transitionTimeoutRef.current !== null) clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = setTimeout(() => {
      transitionTimeoutRef.current = null;
      onSectionChange(section);
      setIsTransitioning(false);
      announceToScreenReader(`${fileName} loaded`, 'polite');
    }, duration);
  }, [onSectionChange, navigationState.isMobileMenuOpen, actions, viewport.isMobile]);

  // Handle terminal commands
  const handleCommand = useCallback((command: string) => {
    handleSectionChange(command);
  }, [handleSectionChange]);

  // Handle orientation changes and layout adaptation
  useEffect(() => {
    // Preserve current state during layout changes
    const preserveState = () => {
      // Auto-close mobile menu when switching to desktop
      if (viewport.isDesktop && navigationState.isMobileMenuOpen) {
        actions.closeMobileMenu();
      }
      
      // Adjust terminal state based on layout mode
      if (viewport.isMobile && navigationState.currentLayout === LayoutMode.SINGLE_PANEL) {
        // On mobile, terminal should be collapsible
        if (navigationState.isTerminalExpanded) {
          // Keep terminal expanded if it was already expanded
        }
      }
      
      // Announce layout changes to screen readers
      const layoutModeNames = {
        [LayoutMode.SINGLE_PANEL]: 'mobile',
        [LayoutMode.DUAL_PANEL]: 'tablet',
        [LayoutMode.THREE_PANEL]: 'desktop'
      };
      
      const layoutName = layoutModeNames[navigationState.currentLayout] || 'unknown';
      announceToScreenReader(`Layout changed to ${layoutName} mode`, 'polite');
    };

    preserveState();
  }, [viewport.layoutMode, viewport.isDesktop, viewport.isMobile, navigationState, actions]);

  // Click-outside collapses terminal
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-terminal-region]')) {
        setIsTerminalFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Terminal height: collapsed differs by route type, expanded is fixed
  const isReadingPage = currentSection?.startsWith('writing/');
  const collapsedHeight = isReadingPage ? 72 : 132;
  const terminalHeight = isTerminalFocused ? 288 : collapsedHeight;

  // Get layout classes based on current layout mode
  const layoutClasses = getLayoutClasses(navigationState.currentLayout);

  // Get layout mode name for accessibility
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
      } else if (navigationState.isTerminalExpanded && viewport.isMobile) {
        actions.setTerminalExpanded(false);
        announceToScreenReader('Terminal collapsed', 'polite');
      }
    },
    'ctrl+?': () => {
      setShowKeyboardHelp(!showKeyboardHelp);
      announceToScreenReader(
        showKeyboardHelp ? 'Keyboard shortcuts help closed' : 'Keyboard shortcuts help opened',
        'polite'
      );
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
    'ctrl+t': () => {
      if (viewport.isMobile) {
        actions.toggleTerminal();
        const message = navigationState.isTerminalExpanded
          ? 'Terminal expanded'
          : 'Terminal collapsed';
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

  // Mobile: render the dedicated MobileShell (replaces all desktop IDE chrome)
  if (viewport.isMobile) {
    return (
      <>
        <MobileShell onThemeChange={onThemeChange} />
        <Suspense fallback={null}>
          <LazyCommandPalette
            isOpen={palette.isOpen}
            mode={palette.mode}
            onClose={palette.close}
            onThemeChange={onThemeChange}
          />
        </Suspense>
      </>
    );
  }

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

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={navigationState.isMobileMenuOpen}
        onClose={actions.closeMobileMenu}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        files={files}
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

      {/* Terminal - Responsive Layout with Lazy Loading */}
      {viewport.isMobile ? (
        <ConditionalLazy 
          fallback={
            <div className="h-56 border-t border-border flex items-center justify-center">
              <span className="text-green-400 font-mono text-sm">Loading terminal...</span>
            </div>
          }
        >
          <LazyResponsiveTerminal
            onCommand={handleCommand}
            currentSection={currentSection}
            onThemeChange={onThemeChange}
            isMobile={viewport.isMobile}
            isTablet={viewport.isTablet}
            isExpanded={navigationState.isTerminalExpanded}
            onToggleExpanded={actions.toggleTerminal}
          />
        </ConditionalLazy>
      ) : (
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
      )}

      {/* Status Bar - Desktop/Tablet only (mobile has enough bottom UI) */}
      {!viewport.isMobile && <StatusBar currentSection={currentSection} />}

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp />

      {/* Command Palette — Cmd+P / Cmd+Shift+P */}
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