/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryValues<T> (defaultValues: T): T {
  const { search } = useLocation();

  const values: T = useMemo(() => {
    const params = new URLSearchParams(search);
    const valuesMap = {};

    Object.keys(defaultValues as object).map(key => {
      const value = params.get(key);

      if (Array.isArray((defaultValues as any)[key]) && value) {
        Object.assign(valuesMap, { [key]: decodeURIComponent(value).split(',') });
      }
      else {
        Object.assign(valuesMap, {
          [key]: value
            ? decodeURIComponent(value)
            : (defaultValues as any)[key]
        });
      }
    });

    return valuesMap as T;
  }, [search, defaultValues]);

  return values;
}
