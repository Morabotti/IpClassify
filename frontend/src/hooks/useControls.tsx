import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePagination } from '@hooks';
import { getQueryParamsCount } from '@utils/queryUtils';
import { QueryParams } from '@enums';
import { PaginationControlOptions, PaginationMemory, PaginationQuery } from '@types';
import { defaultPagination } from '@constants';

interface ControlsContext {
  page: number;
  rows: number;
  toQuery: PaginationQuery;
  onChangeRows: (set: number) => void;
  onChangePage: (set: number) => void;
  paginationFilter: (item: unknown, index: number) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetPagination: (cb: any) => void;
}

export const useControls = ({
  defaultRows = (defaultPagination.rows ?? 50),
  defaultPage = (defaultPagination.page ?? 0),
  defaultPageKey = QueryParams.Page,
  defaultRowsKey = QueryParams.Rows,
  memory = false
}: PaginationControlOptions = {}): ControlsContext => {
  const { pathname, state, search } = useLocation();
  const navigate = useNavigate();
  const { page, rows, paginationFilter, toQuery } = usePagination({
    defaultPage,
    defaultPageKey,
    defaultRows,
    defaultRowsKey
  });

  const [memoryQuery, setMemoryQuery] = useState<PaginationMemory>({ page: defaultPage, rows: defaultRows });

  const updatePath = useCallback((newRows: number, newPage: number) => {
    const params = new URLSearchParams(search);

    const pageParam = params.get(defaultPageKey);
    const rowsParam = params.get(defaultRowsKey);
    let changed = false;

    if (parseInt(pageParam || `${defaultPage}`) !== newPage) {
      params.set(defaultPageKey, newPage.toString());
      changed = true;
    }

    if (parseInt(rowsParam || `${defaultRows}`) !== newRows) {
      params.set(defaultRowsKey, newRows.toString());
      changed = true;
    }

    const numberOfKeys = getQueryParamsCount(params);

    const url = numberOfKeys !== 0
      ? `${pathname}?${params}`
      : pathname;

    if (changed) {
      navigate(url, { replace: true, state });
    }
  }, [pathname, navigate, search, defaultPageKey, defaultRowsKey, state, defaultRows, defaultPage]);

  const onChangeRows = useCallback((set: number) => {
    if (memory) {
      setMemoryQuery(prev => ({ ...prev, rows: set }));
    }
    else {
      updatePath(set, page);
    }
  }, [updatePath, page, memory]);

  const onChangePage = useCallback((set: number) => {
    if (memory) {
      setMemoryQuery(prev => ({ ...prev, page: set }));
    }
    else {
      updatePath(rows, set);
    }
  }, [rows, updatePath, memory]);

  const inMemoryFilter = useCallback((item: unknown, index: number): boolean => {
    return index >= (memoryQuery.page * memoryQuery.rows) - memoryQuery.rows && index < memoryQuery.page * memoryQuery.rows;
  }, [memoryQuery]);

  const resetPagination = useCallback((cb: () => void) => {
    if (memory) {
      setMemoryQuery(prev => ({ ...prev, page: defaultPage }));
    }
    else {
      updatePath(rows, defaultPage);
    }

    cb();
  }, [memory, updatePath, defaultPage, rows]);

  return {
    onChangePage,
    onChangeRows,
    page: memory ? memoryQuery.page : page,
    rows: memory ? memoryQuery.rows : rows,
    paginationFilter: memory ? inMemoryFilter : paginationFilter,
    toQuery: memory ? memoryQuery : toQuery,
    resetPagination
  };
};
