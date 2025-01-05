import { TagEntry, TagValue, TagFilterOption, TagOption } from '@types';
import { getFilterTags, updateSearchFilterTags } from '@utils/tagUtils';
import { getQueryParamsCount } from '@utils/queryUtils';
import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Options {
  options?: TagFilterOption[];
  defaultEntries?: TagEntry[];
}

export interface TagFiltersContract {
  entries: TagEntry[];
  tagValues: TagValue[];
  tagOptions: TagFilterOption[];
  defaultEntries: TagEntry[];
  queryParams?: Record<string, string>;
  onAddOptions: (id: string, option: TagOption[]) => void;
  onAddEntry: () => void;
  onUpdateEntry: (index: number, set: TagEntry) => void;
  onDeleteEntry: (index: number) => void;
  onSubmitValues: (values: TagValue[]) => void;
}

export const useTagFilters = ({
  options = [],
  defaultEntries = []
}: Options = {
  defaultEntries: [],
  options: []
}): TagFiltersContract => {
  const navigate = useNavigate();
  const { search, state, pathname } = useLocation();
  const [tagOptions, setTagOptions] = useState<TagFilterOption[]>(options);

  const [intialEntries, tagValues, queryParams] = useMemo(() => {
    return getFilterTags(tagOptions, search, defaultEntries, state ?? {});
  }, [tagOptions, state, search, defaultEntries]);

  const [entries, setEntries] = useState<TagEntry[]>(intialEntries);

  const onAddOptions = useCallback((id: string, option: TagOption[]) => {
    setTagOptions(prev => prev.map(tag => tag.id === id
      ? { ...tag, options: option }
      : tag)
    );
  }, []);

  const replaceCategoryFilters = useCallback((urlParams: URLSearchParams, newState: Record<string, unknown>) => {
    const queryEmpty = getQueryParamsCount(urlParams) === 0;

    navigate(
      `${pathname}${queryEmpty ? '' : `?${urlParams.toString()}`}`,
      { state: newState, replace: true }
    );
  }, [pathname, navigate]);

  const onAddEntry = () => {
    setEntries(prev => [...prev, { id: null }]);
  };

  const onDeleteEntry = useCallback((index: number) => {
    const newEntries = entries.filter((i, j) => j !== index);
    setEntries(newEntries);

    const [newSearch, newState] = updateSearchFilterTags(
      tagOptions,
      search,
      defaultEntries,
      [],
      newEntries,
      (state ?? {})
    );

    replaceCategoryFilters(newSearch, newState);
  }, [entries, tagOptions, search, state, replaceCategoryFilters, defaultEntries]);

  const onUpdateEntry = useCallback((index: number, set: TagEntry) => {
    const newEntries = entries.map((i, j) => j === index ? set : i);
    setEntries(newEntries);

    const [newSearch, newState] = updateSearchFilterTags(
      tagOptions,
      search,
      defaultEntries,
      [],
      newEntries,
      (state ?? {})
    );

    replaceCategoryFilters(newSearch, newState);
  }, [replaceCategoryFilters, tagOptions, search, state, entries, defaultEntries]);

  const onSubmitValues = useCallback((values: TagValue[]) => {
    const [newSearch, newState] = updateSearchFilterTags(
      tagOptions,
      search,
      defaultEntries,
      values,
      entries,
      (state ?? {})
    );

    replaceCategoryFilters(newSearch, newState);
  }, [search, tagOptions, entries, state, replaceCategoryFilters, defaultEntries]);

  return {
    tagOptions,
    tagValues,
    defaultEntries,
    entries,
    queryParams,
    onAddOptions,
    onSubmitValues,
    onAddEntry,
    onDeleteEntry,
    onUpdateEntry
  };
};
