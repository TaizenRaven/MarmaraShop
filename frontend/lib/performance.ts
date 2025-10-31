/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToInteractive?: number;
}

/**
 * Measure Core Web Vitals
 */
export function measureCoreWebVitals(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: PerformanceMetrics = {
      pageLoadTime: performance.now(),
    };

    // Measure FCP (First Contentful Paint)
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Measure LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.largestContentfulPaint = lastEntry.startTime;
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        // Clean up after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(metrics);
        }, 5000);
      } catch (error) {
        resolve(metrics);
      }
    } else {
      resolve(metrics);
    }
  });
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '', {
      page_path: pagePath,
    });
  }
}

/**
 * Track event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventData || {});
  }
}

/**
 * Track product view
 */
export function trackProductView(product: any): void {
  trackEvent('view_item', {
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        currency: 'USD',
      },
    ],
  });
}

/**
 * Track add to cart
 */
export function trackAddToCart(product: any, quantity: number): void {
  trackEvent('add_to_cart', {
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: quantity,
        currency: 'USD',
      },
    ],
  });
}

/**
 * Track purchase
 */
export function trackPurchase(order: any): void {
  trackEvent('purchase', {
    transaction_id: order.id,
    value: order.total,
    currency: 'USD',
    items: order.items.map((item: any) => ({
      item_id: item.productId,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

/**
 * Optimize images for different screen sizes
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  width: number,
  quality: number = 80
): string {
  // In production, use a CDN like Cloudinary or Imgix
  // For now, just return the original URL
  return imageUrl;
}

/**
 * Preload images
 */
export function preloadImage(imageUrl: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  }
}

/**
 * Prefetch resource
 */
export function prefetchResource(url: string, as: 'style' | 'script' | 'image' = 'script'): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  }
}

/**
 * Enable performance monitoring
 */
export function enablePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    // Measure page load time
    window.addEventListener('load', () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page load time: ${pageLoadTime}ms`);
      trackEvent('page_load_time', { value: pageLoadTime });
    });

    // Monitor API performance
    const originalFetch = window.fetch;
    window.fetch = function (...args: any[]) {
      const startTime = performance.now();
      return originalFetch.apply(this, args).then((response: any) => {
        const duration = performance.now() - startTime;
        console.log(`API call duration: ${duration}ms to ${args[0]}`);
        return response;
      });
    };
  }
}

// Global gtag function type
declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}
