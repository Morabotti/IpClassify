import { createStateParams } from '@utils/queryUtils';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useQuerySync<T> (value: T, delay: number = 0): T | null {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const first = useRef(false);
  const latest = useRef<T | null>(null);

  const [updated, setUpdated] = useState<null | T>(null);

  useEffect(() => {
    if (!first.current) {
      first.current = true;
      return;
    }

    if (Object.entries(latest.current ?? {}).toString() === Object.entries(value as object).toString()) {
      return;
    }

    latest.current = value;

    const newPath = `${pathname}?${createStateParams(value, search)}`;

    if (delay === 0) {
      navigate(newPath, { replace: true });
      setUpdated(value);
      return;
    }

    const handler = setTimeout(() => {
      navigate(newPath, { replace: true });
      setUpdated(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, pathname, navigate, search]);

  return updated;
}
