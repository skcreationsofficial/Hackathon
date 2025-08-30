import { useCallback, useRef } from "react";

/**
 * Custom Debounce Hook
 * @param func - The function to be debounced
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
const useDebounce = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
): ((...args: T) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunc = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFunc;
};

export default useDebounce;