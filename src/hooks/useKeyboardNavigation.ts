import { useEffect, useCallback } from 'react';

export interface KeyboardNavigationConfig {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: string[]; // Keys that should prevent default behavior
}

/**
 * Hook for handling keyboard navigation consistently across components
 */
export const useKeyboardNavigation = (config: KeyboardNavigationConfig) => {
  const {
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onHome,
    onEnd,
    onTab,
    enabled = true,
    preventDefault = []
  } = config;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't intercept keys when focus is inside a text input or textarea
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }

    // Check if we should prevent default for this key
    if (preventDefault.includes(event.key)) {
      event.preventDefault();
    }

    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight();
        }
        break;
      case 'Home':
        if (onHome) {
          event.preventDefault();
          onHome();
        }
        break;
      case 'End':
        if (onEnd) {
          event.preventDefault();
          onEnd();
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(event);
        }
        break;
    }
  }, [
    enabled,
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onHome,
    onEnd,
    onTab,
    preventDefault
  ]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  return { handleKeyDown };
};

/**
 * Hook for managing focus within a list of items (like navigation menus)
 */
export const useListKeyboardNavigation = (
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (index: number) => void,
  onActivate?: (index: number) => void,
  enabled: boolean = true
) => {
  const config: KeyboardNavigationConfig = {
    onArrowDown: () => {
      const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    },
    onArrowUp: () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    },
    onHome: () => {
      onIndexChange(0);
      items[0]?.focus();
    },
    onEnd: () => {
      const lastIndex = items.length - 1;
      onIndexChange(lastIndex);
      items[lastIndex]?.focus();
    },
    onEnter: () => {
      if (onActivate && currentIndex >= 0) {
        onActivate(currentIndex);
      }
    },
    onSpace: () => {
      if (onActivate && currentIndex >= 0) {
        onActivate(currentIndex);
      }
    },
    enabled,
    preventDefault: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ']
  };

  return useKeyboardNavigation(config);
};

/**
 * Hook for global keyboard shortcuts
 */
export const useGlobalKeyboardShortcuts = (
  shortcuts: Record<string, () => void>,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key combination string
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.altKey) modifiers.push('alt');
      if (event.shiftKey) modifiers.push('shift');
      if (event.metaKey) modifiers.push('meta');
      
      const key = event.key.toLowerCase();
      const combination = [...modifiers, key].join('+');
      
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

/**
 * Hook for managing tab order and focus trapping
 */
export const useFocusManagement = (
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, [containerRef]);

  const focusFirst = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab') return;

    const elements = getFocusableElements();
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab: moving backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [getFocusableElements, isActive]);

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.addEventListener('keydown', trapFocus);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('keydown', trapFocus);
        }
      };
    }
  }, [trapFocus, isActive, containerRef]);

  return {
    getFocusableElements,
    focusFirst,
    focusLast,
    trapFocus
  };
};