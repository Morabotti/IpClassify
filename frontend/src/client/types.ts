export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';

export interface RequestOptions {
  body?: unknown;
  params?: unknown;
  skipJson?: boolean;
  blob?: boolean;
  token?: string;
};
