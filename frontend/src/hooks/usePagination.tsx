import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getQueryNumber } from '@utils/queryUtils';
import { QueryParams } from '@enums';
import { PaginationOptions, PaginationQuery } from '@types';
import { defaultPagination } from '@constants';

interface PaginationContext {
  page: number;
  rows: number;
  toQuery: PaginationQuery;
  paginationFilter: (item: unknown, index: number) => boolean;
}

export const usePagination = ({
  defaultRows = (defaultPagination.rows ?? 50),
  defaultPage = (defaultPagination.page ?? 1),
  defaultPageKey = QueryParams.Page,
  defaultRowsKey = QueryParams.Rows
}: PaginationOptions = {}): PaginationContext => {
  const { search } = useLocation();

  const { page, rows } = useMemo(() => {
    const params = new URLSearchParams(search);
    const rowsParam = getQueryNumber(params, defaultRowsKey);
    const pageParam = getQueryNumber(params, defaultPageKey);

    return {
      page: pageParam ?? defaultPage,
      rows: rowsParam ?? defaultRows
    };
  }, [search, defaultRows, defaultPage, defaultPageKey, defaultRowsKey]);

  const toQuery = useMemo(() => ({ page, rows }), [page, rows]);

  const paginationFilter = useCallback(
    (item: unknown, index: number): boolean => {
      return index >= (page * rows) - rows && index < page * rows;
    },
    [page, rows]
  );

  return {
    page,
    rows,
    toQuery,
    paginationFilter
  };
};
