import { TrafficLevel } from '@enums';
import { DateQuery, PaginationQuery } from '@types';

export const defaultPagination: PaginationQuery = { page: 1, rows: 50 };
export const emptyDateQuery: DateQuery = { after: null, before: null };

export const trafficLevels = [
  { label: 'Show all', value: null },
  { label: 'Only normal', value: TrafficLevel.NORMAL },
  { label: 'Only warning', value: TrafficLevel.WARNING },
  { label: 'Only Danger', value: TrafficLevel.DANGER }
];
