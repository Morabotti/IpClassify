import { TrafficLevel } from '@enums';
import { DateQuery, PaginationQuery, TagFilterOption } from '@types';
import { createDateRangeField } from '@utils/tagUtils';

export const defaultPagination: PaginationQuery = { page: 0, rows: 50 };
export const emptyDateQuery: DateQuery = { after: null, before: null };

export const trafficLevels = [
  { label: 'Show all', value: null },
  { label: 'Only normal', value: TrafficLevel.NORMAL },
  { label: 'Only warning', value: TrafficLevel.WARNING },
  { label: 'Only Danger', value: TrafficLevel.DANGER }
];

export const accessRecordTagsOptions: TagFilterOption[] = [
  createDateRangeField('createdAt', 'Creation time', ['after', 'before', '_label']),
  { id: 'application', key: 'application', label: 'Application', type: 'auto-complete' },
  { id: 'country', key: 'country', label: 'Country', type: 'auto-complete' },
  { id: 'city', key: 'city', label: 'City', type: 'auto-complete' },
  { id: 'zip', key: 'zip', label: 'Zip', type: 'string' },
  {
    id: 'isMobile',
    key: 'isMobile',
    label: 'Mobile',
    type: 'boolean',
    formatValue: value => value ? 'Only mobile networks' : 'Only non-mobile networks',
    fromSearch: value => value === 'true',
    toSearch: value => value ? 'true' : 'false'
  },
  { id: 'timezone', key: 'timezone', label: 'Timezone', type: 'option' },
  {
    id: 'level',
    key: 'level',
    label: 'IP Classification',
    type: 'option',
    options: [
      { label: 'Only normal', value: TrafficLevel.NORMAL },
      { label: 'Only warning', value: TrafficLevel.WARNING },
      { label: 'Only Danger', value: TrafficLevel.DANGER }
    ]
  }
];
