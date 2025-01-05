import { Dayjs } from 'dayjs';

export type TableAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';
export type TagFilterType = 'string' | 'number' | 'date' | 'boolean' | 'date-range' | 'option' | 'auto-complete';

export interface ContextMenu {
  open: boolean;
  ref?: HTMLElement | null;
  mouseX?: number;
  mouseY?: number;
}

export interface SimpleContextMenu<T> extends ContextMenu {
  item: T | null;
}

export interface TableHeaderCell {
  label: string;
  longLabel?: string;
  disableSorting?: boolean;
  width?: number | string;
  minWidth?: number;
  span?: number;
  unit?: string;
  padding?: 'normal' | 'checkbox' | 'none';
  align?: TableAlign;
  type?: 'date';
  valueFormatter?: (value: unknown) => string;
}

export interface CustomCell extends TableHeaderCell {
  id: string;
  renderCell?: (row: unknown, index: number) => React.ReactNode;
}

export interface HeadCell<T> extends TableHeaderCell {
  id: keyof T | '';
  renderCell?: (row: T, index: number) => React.ReactNode;
}

export interface PaginationOptions {
  defaultRows?: number;
  defaultPage?: number;
  defaultPageKey?: string;
  defaultRowsKey?: string;
}

export interface PaginationControlOptions extends PaginationOptions {
  memory?: boolean;
}

export interface Pagination<T> {
  result: T[];
  count: number;
}

export interface PaginationMemory {
  page: number;
  rows: number;
}

export interface DateField {
  label: string;
  after: number;
  before: number;
}

export interface DateRangeState {
  after: Dayjs | null;
  before: Dayjs | null;
  label: string;
}

export interface TagOption {
  label: string;
  value: unknown;
}

export interface TagValue {
  key: string;
  value: unknown;
}

export interface TagFilterOption {
  id: string;
  key: string | string[];
  type: TagFilterType;
  label: string;
  options?: TagOption[];
  emptyLabel?: string;
  emptyValue?: string;
  defaultValue?: unknown;
  placeHolderHelper?: string;
  formatValue?: (value: unknown) => string;
  fromSearch?: (value: string, key: string) => unknown;
  toSearch?: (value: unknown, key: string) => string | null;
}

export interface TagEntry {
  id: string | null;
}
