export type WebSocketState = 'closed' | 'loading' | 'error' | 'ready';

export enum WSMessageType {
  ECHO = 'ECHO',
  INTERVAL_HISTORY = 'INTERVAL_HISTORY',
  INTERVAL_RESPONSE = 'INTERVAL_RESPONSE'
}

export interface WSMessage<T> {
  type: WSMessageType;
  data: T;
}
