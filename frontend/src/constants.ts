import { TrafficLevel } from '@enums';
import { DateQuery, PaginationQuery, TagFilterOption } from '@types';
import { createDateRangeField } from '@utils/tagUtils';

export const defaultPagination: PaginationQuery = { page: 1, rows: 50 };
export const emptyDateQuery: DateQuery = { after: null, before: null };

export const trafficLevels = [
  { label: 'Show all', value: null },
  { label: 'Only normal', value: TrafficLevel.NORMAL },
  { label: 'Only warning', value: TrafficLevel.WARNING },
  { label: 'Only Danger', value: TrafficLevel.DANGER }
];

export const accessRecordTagsOptions: TagFilterOption[] = [
  createDateRangeField('createdAt', 'Creation time', ['after', 'before', '_label']),
  { id: 'application', key: 'application', label: 'Application', type: 'string' },
  { id: 'country', key: 'country', label: 'Country', type: 'string' },
  { id: 'city', key: 'city', label: 'City', type: 'string' },
  { id: 'zip', key: 'zip', label: 'Zip', type: 'string' },
  {
    id: 'isMobile',
    key: 'isMobile',
    label: 'Mobile',
    type: 'boolean',
    formatValue: value => value ? 'Only mobile records' : 'Only non-mobile records',
    fromSearch: value => value === 'true',
    toSearch: value => value ? 'true' : 'false'
  },
  {
    id: 'level',
    key: 'level',
    label: 'IP Classification',
    type: 'option',
    emptyValue: '',
    defaultValue: '',
    options: [
      { label: 'Only normal', value: TrafficLevel.NORMAL },
      { label: 'Only warning', value: TrafficLevel.WARNING },
      { label: 'Only Danger', value: TrafficLevel.DANGER }
    ]
  }
];
