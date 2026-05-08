/**
 * Performance monitoring and optimization utilities for mobile devices
 */

export interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  isLowEndDevice: boolean;
  supportsWillChange: boolean;
  supportsTransform3d: boolean;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private rafId: number | null = null;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  private capabilities: Pick<PerformanceMetrics, 'isLowEndDevice' | 'supportsWillChange' | 'supportsTransform3d'>;

  constructor() {
    // Detect once — these values are static after page load
    this.capabilities = {
      isLowEndDevice: this.isLowEndDevice(),
      supportsWillChange: CSS.supports('will-change', 'transform'),
      supportsTransform3d: CSS.supports('transform', 'translate3d(0,0,0)'),
    };
    this.startMonitoring();
  }

  private detectDeviceCapabilities() {
    return this.capabilities;
  }

  private isLowEndDevice(): boolean {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;
    
    // Check memory if available
    const memory = (navigator as any).deviceMemory;
    
    // Check connection type if available
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    return cores <= 2 || (memory && memory <= 2) || isSlowConnection || false;
  }

  private startMonitoring() {
    const measureFrame = (currentTime: number) => {
      this.frameCount++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Notify callbacks with current metrics
        const metrics: PerformanceMetrics = {
          fps: this.fps,
          memoryUsage: this.getMemoryUsage(),
          ...this.detectDeviceCapabilities()
        };
        
        this.callbacks.forEach(callback => callback(metrics));
      }
      
      this.rafId = requestAnimationFrame(measureFrame);
    };
    
    this.rafId = requestAnimationFrame(measureFrame);
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return undefined;
  }

  public subscribe(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  public getCurrentFPS(): number {
    return this.fps;
  }

  public destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.callbacks = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export const getPerformanceMonitor = (): PerformanceMonitor => {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
};

// Animation optimization utilities
export const optimizeAnimation = (element: HTMLElement, property: string) => {
  // Use will-change for better performance
  element.style.willChange = property;
  
  // Use transform3d to trigger hardware acceleration
  if (property.includes('transform')) {
    element.style.transform = element.style.transform || 'translate3d(0,0,0)';
  }
  
  // Cleanup function
  return () => {
    element.style.willChange = 'auto';
  };
};

// Debounce utility for performance-sensitive operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle utility for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get optimal animation duration based on device performance
export const getOptimalAnimationDuration = (baseMs: number): number => {
  const monitor = getPerformanceMonitor();
  const fps = monitor.getCurrentFPS();
  
  // Reduce animation duration on low-performance devices
  if (fps < 30) return baseMs * 0.5;
  if (fps < 45) return baseMs * 0.75;
  
  return baseMs;
};