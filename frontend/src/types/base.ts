import { Dayjs } from 'dayjs';

export type TableAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';

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
