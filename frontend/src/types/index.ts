import { TrafficLevel } from '@enums';
import { DateQuery } from './query';

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

export interface TrafficSummary {
  normal: number;
  warning: number;
  danger: number;
  time: number;
}

export interface TrafficSummaryFormatted extends TrafficSummary {
  timestamp: string;
}

export interface AccessRecord {
  id: string;
  application: string;
  path: string;
  method: string;
  ip: string;
  requestId: string;
  userId: string;
  userAgent: string;
  referrer: string;
  acceptLanguage: string;
  continent: string;
  country: string;
  region: string;
  city: string;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  isp: string;
  org: string;
  isMobile: boolean;
  isProxy: boolean;
  isHosting: boolean;
  danger: boolean;
  warning: boolean;
  createdAt: number;
  processedAt: number;
  uploadedAt: number;
}

export interface IpClassification {
  ip: string;
  isDanger: boolean;
  isWarning: boolean;
}

export interface IpLocation {
  ip: string;
  continent: string;
  continentCode: string;
  country: string;
  region: string;
  regionName: string;
  zip: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
  isp: string;
  org: string;
  isMobile: boolean;
  isProxy: boolean;
  isHosting: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface IpInformation {
  ip: string;
  classification: IpClassification;
  location: IpLocation;
}

export interface AccessSummary {
  label: string;
  level: TrafficLevel;
  count: number;
}

export interface DateQueryWithLabel extends DateQuery {
  label: string | null;
};

export interface MockTrafficRequestState {
  onlyKnown: boolean;
  from: string | null;
  customAmount: number;
};

export interface MockTrafficRequest {
  onlyKnown: boolean;
  amount: number;
  from: string | null;
};

export interface IpClassifyRequest {
  ip: string;
  id: string | null;
  level: TrafficLevel;
  updateHistory: boolean;
}
