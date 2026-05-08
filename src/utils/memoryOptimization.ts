/**
 * Memory optimization utilities for mobile performance
 */

// Memory cleanup utilities
export class MemoryManager {
  private static cleanupTasks: (() => void)[] = [];
  private static memoryWarningThreshold = 0.8;
  private static isMonitoring = false;
  private static intervalId: ReturnType<typeof setInterval> | null = null;
  private static visibilityHandler: (() => void) | null = null;

  static init() {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;
    this.startMemoryMonitoring();
    this.setupPageVisibilityHandling();
  }

  static destroy() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
    this.isMonitoring = false;
    this.cleanupTasks = [];
  }

  private static startMemoryMonitoring() {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (!memory) return;

      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

      if (usage > this.memoryWarningThreshold) {
        console.warn('High memory usage detected:', usage);
        this.performCleanup();
      }
    };

    this.intervalId = setInterval(checkMemory, 30000);
  }

  private static setupPageVisibilityHandling() {
    this.visibilityHandler = () => {
      if (document.hidden) {
        this.performCleanup();
        this.pauseNonEssentialAnimations();
      } else {
        this.resumeAnimations();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  static addCleanupTask(task: () => void) {
    this.cleanupTasks.push(task);
  }

  static removeCleanupTask(task: () => void) {
    const index = this.cleanupTasks.indexOf(task);
    if (index > -1) {
      this.cleanupTasks.splice(index, 1);
    }
  }

  static performCleanup() {
    // Execute all registered cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Cleanup task failed:', error);
      }
    });

    // Force garbage collection if available (Chrome DevTools)
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  private static pauseNonEssentialAnimations() {
    // Pause CSS animations
    const style = document.createElement('style');
    style.id = 'memory-optimization-pause';
    style.textContent = `
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(style);
  }

  private static resumeAnimations() {
    const style = document.getElementById('memory-optimization-pause');
    if (style) {
      style.remove();
    }
  }

  static getMemoryInfo() {
    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      usage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
    };
  }
}

// Component-level memory optimization
export const useMemoryOptimization = () => {
  const cleanup = () => {
    // Clear any component-specific caches, timers, etc.
  };

  // Register cleanup task
  MemoryManager.addCleanupTask(cleanup);

  return {
    cleanup,
    memoryInfo: MemoryManager.getMemoryInfo()
  };
};

// Image optimization for memory efficiency
export const optimizeImageLoading = (img: HTMLImageElement, options: {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
} = {}) => {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

  // Use intersection observer to load images only when needed
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement;
        const src = image.dataset.src;
        
        if (src) {
          // Create optimized image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            const tempImg = new Image();
            tempImg.onload = () => {
              // Calculate optimal dimensions
              let { width, height } = tempImg;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              ctx.drawImage(tempImg, 0, 0, width, height);
              
              // Convert to optimized format
              const optimizedSrc = canvas.toDataURL('image/webp', quality);
              image.src = optimizedSrc;
              
              // Cleanup
              canvas.remove();
            };
            
            tempImg.src = src;
          }
        }
        
        observer.unobserve(image);
      }
    });
  });

  observer.observe(img);
  
  return () => observer.unobserve(img);
};

// Layout optimization to prevent memory leaks
export const optimizeLayoutChanges = () => {
  let rafId: number | null = null;
  const pendingUpdates: (() => void)[] = [];

  const flushUpdates = () => {
    const updates = pendingUpdates.splice(0);
    updates.forEach(update => update());
    rafId = null;
  };

  return {
    scheduleUpdate: (update: () => void) => {
      pendingUpdates.push(update);
      
      if (!rafId) {
        rafId = requestAnimationFrame(flushUpdates);
      }
    },
    
    cancel: () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingUpdates.length = 0;
    }
  };
};

// Reduced motion preferences support
export const createReducedMotionCSS = () => {
  if (typeof document === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const updateMotionPreferences = () => {
    const style = document.getElementById('reduced-motion-styles') || document.createElement('style');
    style.id = 'reduced-motion-styles';
    
    if (prefersReducedMotion.matches) {
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
        
        .matrix-background {
          display: none !important;
        }
        
        .interactive-cursor {
          display: none !important;
        }
      `;
    } else {
      style.textContent = '';
    }
    
    if (!style.parentNode) {
      document.head.appendChild(style);
    }
  };

  // Initial setup
  updateMotionPreferences();
  
  // Listen for changes
  prefersReducedMotion.addEventListener('change', updateMotionPreferences);
  
  return () => {
    prefersReducedMotion.removeEventListener('change', updateMotionPreferences);
    const style = document.getElementById('reduced-motion-styles');
    if (style) {
      style.remove();
    }
  };
};