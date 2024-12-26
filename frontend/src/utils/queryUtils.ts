/* eslint-disable @typescript-eslint/no-explicit-any */
export const safeParseNumber = (value?: string | null): number | null => {
  if (!value) return null;

  const parsed = parseInt(value);

  return (parsed == null || isNaN(parsed))
    ? null
    : parsed;
};

export const getQueryNumber = (params: URLSearchParams, key: string): number | null => {
  const param = params.get(key);
  return safeParseNumber(param);
};

export const getQueryParamsCount = (params: URLSearchParams): number => {
  let numberOfKeys = 0;

  for (const k of params.keys()) {
    if (k) {
      numberOfKeys++;
    }
  }

  return numberOfKeys;
};

export const createSearchParams = (objects: any[]): string => {
  const query = new URLSearchParams();

  for (const object of objects) {
    if (!object) {
      continue;
    }

    for (const key in object) {
      if (object[key] !== null
        && object[key] !== undefined
        && object[key] !== ''
        && String(object[key]).trim() !== ''
      ) {
        if (Array.isArray(object[key])) {
          query.set(key, object[key].join(','));
        }
        else if (typeof object[key] !== 'function') {
          query.set(key, encodeURIComponent(String(object[key])));
        }
      }
    }
  }

  return query.toString();
};

export function createStateParams<T>(object: T, search: string): string {
  const query = new URLSearchParams(search);

  for (const key in object) {
    if (object[key] !== null
      && object[key] !== undefined
      && (object as any)[key] !== ''
      && (object as any)[key] !== 0
      && typeof object[key] !== 'function'
      && String(object[key]) !== ''
    ) {
      query.set(key, encodeURIComponent(String(object[key])));
    }
    else if (query.get(key) !== null) {
      query.delete(key);
    }
  }

  return query.toString();
}
