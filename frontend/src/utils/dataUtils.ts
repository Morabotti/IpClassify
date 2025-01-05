import { TrafficLevel } from '@enums';
import { AccessRecord, AccessRecordQuery, CommonQuery, DateQuery } from '@types';
import { safeParseNumber } from './queryUtils';

export const getTrafficLevel = (record: AccessRecord): TrafficLevel => {
  if (record.danger) return TrafficLevel.DANGER;
  if (record.warning) return TrafficLevel.WARNING;
  return TrafficLevel.NORMAL;
};

export const tagsToDateQuery = (
  queryParams?: Record<string, string>,
  afterKey = 'after',
  beforeKey = 'before'
): DateQuery => {
  if (!queryParams) return {};

  return {
    after: safeParseNumber(queryParams[afterKey] as string),
    before: safeParseNumber(queryParams[beforeKey] as string)
  };
};

export const tagsToCommonQuery = (queryParams?: Record<string, string>, deboucedSearch?: string): CommonQuery => {
  if (!queryParams) return {};

  return {
    level: queryParams['level'] as TrafficLevel,
    search: deboucedSearch
  };
};

export const tagsToAccessRecordQuery = (queryParams?: Record<string, string>): AccessRecordQuery => {
  if (!queryParams) return {};

  return {
    city: queryParams.city,
    country: queryParams.country,
    ip: queryParams.ip,
    zip: queryParams.zip
  };
};
