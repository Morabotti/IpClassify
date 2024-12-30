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

export interface AccessRecordQuery {
  level?: TrafficLevel | null;
  ip?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
}
