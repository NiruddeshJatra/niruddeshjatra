import React, { useRef, useEffect, useState } from 'react';
import { X, Folder, ChevronRight } from 'lucide-react';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useListKeyboardNavigation, useFocusManagement } from '../hooks/useKeyboardNavigation';
import { getNavigationClasses, getOverlayClasses, Z_INDEX } from '../utils/responsive';
import { 
  createFocusRestorer, 
  getNavigationAria, 
  announceToScreenReader,
  MIN_TOUCH_TARGET_SIZE
} from '../utils/accessibility';
import { FileItem } from './FileExplorer';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
  files: FileItem[];
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  currentSection,
  onSectionChange,
  files
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);
  const focusRestorer = useRef(createFocusRestorer());
  
  // Focus management for the drawer
  const { focusFirst } = useFocusManagement(drawerRef, isOpen);

  // Handle swipe-to-close gesture
  useTouchGestures(drawerRef, {
    onSwipeLeft: () => {
      if (isOpen) {
        onClose();
      }
    }
  });

  // Handle backdrop tap to close
  useTouchGestures(overlayRef, {
    onTap: () => {
      if (isOpen) {
        onClose();
      }
    }
  });

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Enhanced focus management for accessibility
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Save the previously focused element
      focusRestorer.current.save();
      
      // Focus the first focusable element in the drawer
      setTimeout(() => focusFirst(), 100);
      
      // Announce navigation opening to screen readers
      announceToScreenReader('Navigation menu opened', 'polite');
      
      // Reset focused item index
      setFocusedItemIndex(-1);
    } else if (!isOpen) {
      // Restore focus when closing
      focusRestorer.current.restore();
      
      // Announce navigation closing to screen readers
      announceToScreenReader('Navigation menu closed', 'polite');
    }
  }, [isOpen, focusFirst]);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    
    // Announce section change to screen readers
    const fileName = files.find(f => f.section === section)?.name || section;
    announceToScreenReader(`Navigated to ${fileName}`, 'polite');
    
    onClose(); // Auto-close on selection
  };

  // Get file buttons for keyboard navigation
  const getFileButtons = () => {
    if (!drawerRef.current) return [];
    return Array.from(
      drawerRef.current.querySelectorAll('[data-file-button]')
    ) as HTMLElement[];
  };

  // Keyboard navigation for file list
  useListKeyboardNavigation(
    getFileButtons(),
    focusedItemIndex,
    setFocusedItemIndex,
    (index) => {
      const file = files[index];
      if (file) {
        handleSectionChange(file.section);
      }
    },
    isOpen
  );

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        ref={overlayRef}
        className={getOverlayClasses(isOpen)}
        style={{ zIndex: Z_INDEX.overlay }}
        aria-hidden={!isOpen}
        role="presentation"
      />

      {/* Navigation Drawer */}
      <nav
        ref={drawerRef}
        className={`${getNavigationClasses(true, isOpen)} bg-black/95 backdrop-blur-sm border-r border-border`}
        style={{ zIndex: Z_INDEX.navigation }}
        aria-label="Mobile navigation menu"
        aria-hidden={!isOpen}
        role="navigation"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/50">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-phosphor-dim" />
            <span className="text-xs font-semibold uppercase tracking-wide">Explorer</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted/50 focus-visible:focus-visible transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
            type="button"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* File Explorer Content */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-2">
            {/* Portfolio folder header */}
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground mb-1">
              <ChevronRight className="w-3 h-3" />
              <Folder className="w-3 h-3 text-phosphor-dim" />
              <span>PORTFOLIO</span>
            </div>
            
            {/* File list */}
            <div className="pl-4 space-y-0.5" role="menu" aria-label="Portfolio sections">
              {files.map((file, index) => {
                const Icon = file.icon;
                const isActive = currentSection === file.section;
                const isFocused = focusedItemIndex === index;
                
                return (
                  <button
                    key={file.section}
                    onClick={() => handleSectionChange(file.section)}
                    data-file-button
                    className={`
                      w-full flex items-center gap-2 px-2 py-2 text-xs text-left rounded
                      transition-all duration-200 group min-h-[${MIN_TOUCH_TARGET_SIZE}px]
                      focus-visible:focus-visible
                      ${isActive 
                        ? 'bg-muted text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }
                      ${isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    `}
                    aria-current={isActive ? 'page' : undefined}
                    aria-describedby={isActive ? `current-section-${file.section}` : undefined}
                    role="menuitem"
                    type="button"
                  >
                    <Icon 
                      className={`w-3 h-3 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-phosphor' : ''
                      }`} 
                      aria-hidden="true"
                    />
                    <span>{file.name}</span>
                    {isActive && (
                      <span 
                        id={`current-section-${file.section}`}
                        className="sr-only"
                      >
                        (current section)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div 
          className="px-3 py-2 border-t border-border bg-muted/20 text-[10px] text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-1">
            <div 
              className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" 
              aria-hidden="true"
            />
            <span>Ready</span>
          </div>
        </div>

        {/* Current section indicator for mobile */}
        {currentSection && (
          <div 
            className="px-3 py-1 bg-primary/10 border-t border-border"
            role="status"
            aria-live="polite"
          >
            <div className="text-xs text-primary font-medium">
              <span className="sr-only">Currently viewing: </span>
              Current: {files.find(f => f.section === currentSection)?.name || currentSection}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default MobileNavigation;
