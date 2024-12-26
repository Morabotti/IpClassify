export type WebSocketState = 'closed' | 'loading' | 'error' | 'ready';

export enum WSMessageType {
  Test = 'test'
}

export interface WSMessage<T> {
  type: WSMessageType;
  data: T;
}
