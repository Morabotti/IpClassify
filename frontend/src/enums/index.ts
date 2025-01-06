export enum LocalStorageKey {
  Token = 'ip-c-token',
  ThemeMode = 'ip-c-theme',
  ThemeSchema = 'ip-c-schema'
}

export enum Client {
  GetAccessRecords = 'access-records',
  GetAccessByIp = 'access-record-information',
  GetAccessSummary = 'access-record-summary',
  GetAccessMetadata = 'access-record-metadata'
}

export enum QueryParams {
  Rows = 'rows',
  Page = 'page',
  Redirect = 'redirect',
  Params = 'params',
  Order = 'order',
  OrderBy = 'orderBy'
}

export enum TrafficLevel {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  DANGER = 'DANGER'
}
