import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryValues<T extends object>(defaultValues: T): T {
  const { search } = useLocation();

  const values: T = useMemo(() => {
    const params = new URLSearchParams(search);
    const valuesMap = {};

    (Object.keys(defaultValues) as (keyof T)[]).map(key => {
      const value = params.get(key as string);

      if (Array.isArray(defaultValues[key]) && value) {
        Object.assign(valuesMap, { [key]: decodeURIComponent(value).split(',') });
      }
      else {
        Object.assign(valuesMap, {
          [key]: value ? decodeURIComponent(value) : defaultValues[key]
        });
      }
    });

    return valuesMap as T;
  }, [search, defaultValues]);

  return values;
}
