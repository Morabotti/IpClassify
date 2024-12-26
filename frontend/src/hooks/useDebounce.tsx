import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const first = useRef(false);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (!first.current) {
      first.current = true;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
