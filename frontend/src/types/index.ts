export * from './base';
export * from './query';
export * from './websocket';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  name: string;
}
