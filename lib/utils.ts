import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 */
export function throttle<T extends AnyFunction>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      inThrottle = true;
      func(...args);
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

/**
 * Safe JSON parse with type validation
 * @deprecated Use JSON.parse directly with try/catch in the calling code for better type safety
 */
export function safeJSONParse<T>(value: string, fallback: T): T {
  console.warn('safeJSONParse is deprecated. Use JSON.parse directly with try/catch for better type safety');
  return fallback;
} 