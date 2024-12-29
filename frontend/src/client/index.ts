import { AccessRecord, AccessSummary, AggregationQuery, AuthResponse, CommonQuery, DateQuery, LoginRequest, Pagination, PaginationQuery, SortQuery } from '@types';
import { createClient } from './clientUtils';

export { setAuthToken, clearAuthToken } from './clientUtils';

declare const API_URL: string;
const hostName = `http://${API_URL}`;
const query = createClient(hostName, '/api/v1');

export const authApi = {
  authenticate: (body: LoginRequest) => query<AuthResponse>('/auth/login', 'POST', { body }),
  getMe: (token: string) => query<AuthResponse>(`/auth/me`, 'GET', { token })
};

export const accessApi = {
  getAll: (p: PaginationQuery, s: SortQuery, d: DateQuery) => query<Pagination<AccessRecord>>(`/access`, 'GET', { params: [p, s, d] }),
  getById: (id: string) => query<AccessRecord>(`/access/${id}`),
  getSummary: (d: DateQuery, a: AggregationQuery, c: CommonQuery) => query<AccessSummary[]>(`/access/summary`, 'GET', { params: [d, a, c] })
};
