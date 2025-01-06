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
  search?: string;
}

export interface AccessRecordQuery {
  ip?: string | null;
  continent?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
  application?: string | null;
  method?: string | null;
  path?: string | null;
  userId?: number | null;
  isp?: string | null;
  timezone?: string | null;
  isMobile?: boolean | null;
  isProxy?: boolean | null;
  isHosting?: boolean | null;
}
