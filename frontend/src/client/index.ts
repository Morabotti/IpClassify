import { AuthResponse, LoginRequest } from '@types';
import { createClient } from './clientUtils';

export { setAuthToken, clearAuthToken } from './clientUtils';

const hostName = `http://${import.meta.env.API_URL}`;
const query = createClient(hostName, '/api/v1');

export const authApi = {
  authenticate: (body: LoginRequest) => query<AuthResponse>('/auth/login', 'POST', { body }),
  getMe: (token: string) => query<AuthResponse>(`/auth/me`, 'POST', { body: { token } })
};
