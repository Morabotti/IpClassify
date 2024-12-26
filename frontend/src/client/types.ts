export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export interface RequestOptions {
  body?: unknown;
  header?: unknown;
  skipJson?: boolean;
  blob?: boolean;
  token?: string;
};
