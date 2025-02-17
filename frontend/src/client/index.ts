import { AccessRecord, AccessRecordQuery, AccessSummary, AggregationQuery, AuthResponse, CommonQuery, DateQuery, IpClassification, IpClassifyRequest, IpInformation, LoginRequest, MockTrafficRequest, Pagination, PaginationQuery, RecordMetadata, SortQuery } from '@types';
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
  getAll: (a: PaginationQuery, b: SortQuery, c: DateQuery, d: CommonQuery, e: AccessRecordQuery) => query<Pagination<AccessRecord>>(`/access`, 'GET', { params: [a, b, c, d, e] }),
  getByIp: (ip: string) => query<IpInformation>(`/access/${ip}`),
  getSummary: (d: DateQuery, a: AggregationQuery, c: CommonQuery) => query<AccessSummary[]>(`/access/summary`, 'GET', { params: [d, a, c] }),
  getMetadata: () => query<RecordMetadata>(`/access/metadata`),
  updateIpClassification: (body: IpClassifyRequest) => query<IpClassification>(`/access/${body.ip}/classify`, 'PUT', { body })
};

export const trafficApi = {
  create: (body: MockTrafficRequest) => query<Response>(`/traffic`, 'POST', { body, skipJson: true })
};
