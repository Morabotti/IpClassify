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
  { id: 'city', key: 'city', label: 'City', type: 'auto-complete' },
  { id: 'continent', key: 'continent', label: 'Continent', type: 'string' },
  { id: 'country', key: 'country', label: 'Country', type: 'auto-complete' },
  { id: 'ip', key: 'ip', label: 'IP', type: 'string' },
  {
    id: 'isHosting',
    key: 'isHosting',
    label: 'Hosting network',
    type: 'boolean',
    formatValue: value => value ? 'Only hosting networks' : 'Only non-hosting networks',
    fromSearch: value => value === 'true',
    toSearch: value => value ? 'true' : 'false'
  },
  { id: 'isp', key: 'isp', label: 'ISP', type: 'string' },
  {
    id: 'isMobile',
    key: 'isMobile',
    label: 'Mobile network',
    type: 'boolean',
    formatValue: value => value ? 'Only mobile networks' : 'Only non-mobile networks',
    fromSearch: value => value === 'true',
    toSearch: value => value ? 'true' : 'false'
  },
  {
    id: 'isProxy',
    key: 'isProxy',
    label: 'Proxy network',
    type: 'boolean',
    formatValue: value => value ? 'Only proxy networks' : 'Only non-proxy networks',
    fromSearch: value => value === 'true',
    toSearch: value => value ? 'true' : 'false'
  },
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
  },
  {
    id: 'method',
    key: 'method',
    label: 'Method',
    type: 'option',
    options: [
      { label: 'GET', value: 'GET' },
      { label: 'POST', value: 'POST' },
      { label: 'PUT', value: 'PUT' },
      { label: 'DELETE', value: 'DELETE' }
    ]
  },
  { id: 'path', key: 'path', label: 'Target path', type: 'string' },
  { id: 'timezone', key: 'timezone', label: 'Timezone', type: 'option' },
  { id: 'zip', key: 'zip', label: 'Zip', type: 'string' }
];
