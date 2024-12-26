import React, { useState, useCallback, useMemo } from 'react';
import { SortQuery, TableOrder } from '@types';
import { useQueryValues } from '@hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryParams } from '@enums';
import { getQueryParamsCount } from '@utils/queryUtils';

interface ListOrderContext<T> {
  order: TableOrder;
  orderBy: keyof T;
  toQuery: SortQuery;
  onSort: (e: React.MouseEvent<unknown>, property: keyof T) => void;
  sorter: (a: T, b: T) => number;
}

export function useOrder<T> (
  defaultOrderBy: keyof T,
  syncNavigation = false,
  defaultOrder?: TableOrder
): ListOrderContext<T> {
  const { pathname, search, state } = useLocation();
  const navigate = useNavigate();
  const query = useQueryValues<{ order: string; orderBy: string }>({
    order: defaultOrder || 'asc',
    orderBy: defaultOrderBy as string
  });

  const [orderBy, setOrderBy] = useState<keyof T>(query.orderBy as keyof T);
  const [order, setOrder] = useState<TableOrder>((query.order === 'asc' || query.order === 'desc')
    ? query.order as TableOrder
    : defaultOrder ?? 'asc'
  );

  const onSort = useCallback((e: React.MouseEvent<unknown>, property: keyof T) => {
    const newOrder = orderBy === property ? order === 'desc' ? 'asc' : 'desc' : 'desc';

    setOrder(newOrder);
    setOrderBy(property);

    if (syncNavigation) {
      const newSearch = new URLSearchParams(search);

      newSearch.set(QueryParams.Order, newOrder);
      newSearch.set(QueryParams.OrderBy, property.toString());

      if (newOrder === defaultOrder && property === defaultOrderBy) {
        newSearch.delete(QueryParams.Order);
        newSearch.delete(QueryParams.OrderBy);
      }

      navigate(
        `${pathname}${getQueryParamsCount(newSearch) === 0 ? '' : `?${newSearch.toString()}`}`,
        { state }
      );
    }
  }, [orderBy, syncNavigation, search, pathname, navigate, defaultOrderBy, defaultOrder, order, state]);

  const toQuery = useMemo((): SortQuery => ({
    direction: order,
    sort: orderBy as string
  }), [order, orderBy]);

  const sorter = useCallback((a: T, b: T): number => {
    if (typeof a[orderBy] === 'number' || typeof b[orderBy] === 'number') {
      return a[orderBy] > b[orderBy]
        ? (order === 'asc' ? 1 : -1)
        : (order === 'asc' ? -1 : 1);
    }

    return order === 'asc'
      ? String(a[orderBy]).localeCompare(String(b[orderBy]))
      : String(b[orderBy]).localeCompare(String(a[orderBy]));
  }, [orderBy, order]);

  return {
    order,
    orderBy,
    onSort,
    toQuery,
    sorter
  };
}
