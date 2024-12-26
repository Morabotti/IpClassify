export type TableOrder = 'asc' | 'desc';

export interface DateQuery {
  before?: string | null;
  after?: string | null;
}

export interface PaginationQuery {
  page?: number;
  rows?: number;
}

export interface SortQuery {
  sort?: string;
  direction: TableOrder;
}
