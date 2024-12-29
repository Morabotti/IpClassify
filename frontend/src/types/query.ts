import { TrafficLevel } from '@enums';

export type TableOrder = 'ASC' | 'DESC';

export interface DateQuery {
  before?: number | null;
  after?: number | null;
}

export interface PaginationQuery {
  page?: number;
  rows?: number;
}

export interface SortQuery {
  sort?: string;
  direction?: TableOrder;
}

export interface AggregationQuery {
  field: string;
  count?: number;
}

export interface CommonQuery {
  level?: TrafficLevel | null;
}
