import { TagEntry, TagFilterOption, TagValue } from '@types';
import { safeParseNumber } from './queryUtils';
import dayjs from 'dayjs';

export const getDefaultInputValue = (opt?: TagFilterOption | null): unknown => {
  switch (opt?.type) {
    case 'auto-complete': return opt.defaultValue ?? null;
    case 'boolean': return opt.defaultValue ?? true;
    case 'date': return opt.defaultValue ?? null;
    case 'date-range': return opt.defaultValue ?? null;
    case 'number': return opt.defaultValue ?? 0;
    case 'option': return opt.defaultValue ?? null;
    case 'string': return opt.defaultValue ?? '';
    default: return '';
  }
};

export const updateSearchFilterTags = (
  options: TagFilterOption[],
  search: string,
  defaultEntries: TagEntry[],
  newValues: TagValue[],
  existingEntries: TagEntry[],
  existingState: Record<string, unknown>
): [URLSearchParams, Record<string, unknown>] => {
  const searchParams = new URLSearchParams(search);
  const state: Record<string, unknown> = existingState;

  const idsInUse = existingEntries
    .map(i => i.id)
    .filter(i => i !== null)
    .concat(defaultEntries.map(i => i.id as string));

  const keysToBeDeleted = options.filter(i => !idsInUse.includes(i.id))
    .flatMap(i => i.key);

  for (const key of keysToBeDeleted) {
    searchParams.delete(key);
  }

  for (const value of newValues) {
    const option = options.find(i => i.key === value.key || i.key.includes(value.key));
    const paramValue = option?.toSearch ? option.toSearch(value.value, value.key) : value.value as string;

    if (paramValue === undefined || !option) {
      continue;
    }

    if (isPrivate(value.key)) {
      state[value.key] = value.value;
      continue;
    }

    const isDefaultEntry = defaultEntries.map(i => i.id).includes(option.id);

    if (paramValue === null || (paramValue === '' && isDefaultEntry)) {
      searchParams.delete(value.key);
    }
    else {
      searchParams.set(value.key, paramValue);
    }
  }

  return [searchParams, state];
};

export const getFilterTags = (
  options: TagFilterOption[],
  search: string,
  defaultEntries: TagEntry[],
  state: Record<string, unknown>
): [entries: TagEntry[], values: TagValue[], queryParam: Record<string, string>] => {
  const searchParams = new URLSearchParams(search);
  const values: TagValue[] = [];
  const entries: TagEntry[] = [];
  const queries: Record<string, string> = {};

  for (const option of options) {
    let added = false;

    if (option.key instanceof Array) {
      for (const key of option.key) {
        const [value, param] = getFromKey(key, searchParams, state, option.fromSearch);
        if (!value) continue;

        added = true;
        values.push(value);
        if (param) queries[key] = param;
      }
    }
    else {
      const [value, param] = getFromKey(option.key, searchParams, state, option.fromSearch);
      if (!value) continue;

      added = true;
      values.push(value);
      if (param) queries[option.key] = param;
    }

    if (added && !defaultEntries.map(i => i.id).includes(option.id)) {
      entries.push({ id: option.id });
    }
  }

  return [entries, values, queries];
};

const getFromKey = (
  key: string,
  searchParams: URLSearchParams,
  state: Record<string, unknown>,
  fromSearch?: (value: string, key: string) => void
): [value: TagValue | null, param: string | null] => {
  if (isPrivate(key) && state[key]) {
    return [{
      key: key,
      value: fromSearch ? fromSearch(state[key] as string, key) : state[key]
    }, null];
  }

  const param = searchParams.get(key);
  if (!param) return [null, null];

  return [{
    key: key,
    value: fromSearch ? fromSearch(param, key) : param
  }, param];
};

type DateRangeType = [after: string, before: string];
type DateRangeWithLabelType = [after: string, before: string, _label: string];

export const createDateRangeField = (
  id: string,
  label: string,
  keys: DateRangeType | DateRangeWithLabelType = ['after', 'before']
): TagFilterOption => ({
  id: id,
  key: keys,
  label: label,
  emptyValue: 'Not Set',
  type: 'date-range',
  formatValue: value => {
    const [after, before, label] = value as [after: number | null, before: null | number, _label: string | null];
    if (label) return label as string;

    const afterIsValid = !!after && dayjs(after).isValid();
    const beforeIsValid = !!before && dayjs(before).isValid();

    return `${afterIsValid
      ? dayjs(after).format('YYYY-MM-DD-HH:mm:ss')
      : '*'} to ${beforeIsValid
      ? dayjs(before).format('YYYY-MM-DD-HH:mm:ss')
      : '*'}`;
  },
  fromSearch: (value, key) => isPrivate(key) ? value : safeParseNumber(value)
});

export const isPrivate = (key: string) => key.charAt(0) === '_';
