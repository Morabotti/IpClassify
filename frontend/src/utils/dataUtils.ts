import { TrafficLevel } from '@enums';
import { AccessRecord, AccessRecordQuery, CommonQuery, DateQuery, IpClassification, TagOption } from '@types';
import { safeParseNumber } from './queryUtils';

export const getTrafficLevel = (record: AccessRecord): TrafficLevel => {
  if (record.danger) return TrafficLevel.DANGER;
  if (record.warning) return TrafficLevel.WARNING;
  return TrafficLevel.NORMAL;
};

export const getIpClassificationLevel = (record: IpClassification): TrafficLevel => {
  if (record.isDanger) return TrafficLevel.DANGER;
  if (record.isWarning) return TrafficLevel.WARNING;
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
    zip: queryParams.zip,
    application: queryParams.application,
    continent: queryParams.continent,
    isHosting: queryParams.isHosting ? queryParams.isHosting === 'true' : null,
    isMobile: queryParams.isMobile ? queryParams.isMobile === 'true' : null,
    isProxy: queryParams.isProxy ? queryParams.isProxy === 'true' : null,
    isp: queryParams.isp,
    timezone: queryParams.timezone,
    method: queryParams.method,
    path: queryParams.path,
    userId: safeParseNumber(queryParams.userId)
  };
};

export const toTagOptions = (list: string[]): TagOption[] => {
  return list.map(i => ({ label: i, value: i }));
};

export const clamp = (number: number, lower: number, upper: number): number => {
  return Math.min(Math.max(number, lower), upper);
};
