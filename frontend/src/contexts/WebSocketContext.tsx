import { trafficSummaryAtom } from '@atoms';
import { useAuth } from '@hooks';
import { TrafficSummary, WebSocketState, WSMessage, WSMessageType } from '@types';
import { appendAndShift, formatWSMessage } from '@utils/websocketUtils';
import { useSetAtom } from 'jotai';
import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

declare const API_URL: string;
const url = `ws://${API_URL}/ws/v1/endpoint`;

interface WebSocketContextContract {
  state: WebSocketState;
  onMessage: <T>(set: WSMessage<T>) => void;
  onReconnect: () => void;
}

interface Props {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext<WebSocketContextContract>({
  state: 'loading',
  onMessage: () => {},
  onReconnect: () => {}
});

export const WebSocketProvider = ({ children }: Props): React.ReactNode => {
  const { token } = useAuth();
  const websocket = useRef<WebSocket>(null);
  const [state, setState] = useState<WebSocketState>('loading');
  const setTrafficSummary = useSetAtom(trafficSummaryAtom);

  const onRecieve = useCallback((message: WSMessage<unknown>) => {
    switch (message.type) {
      case WSMessageType.ECHO:
        console.log(message.data);
        return;
      case WSMessageType.INTERVAL_HISTORY:
        console.log(message.data);
        setTrafficSummary(message.data as TrafficSummary[]);
        return;
      case WSMessageType.INTERVAL_RESPONSE:
        setTrafficSummary(appendAndShift(message.data as TrafficSummary));
        return;
    }
  }, [setTrafficSummary]);

  const initialize = useCallback(() => {
    if (websocket.current || !token) return;

    setState('loading');
    websocket.current = new WebSocket(`${url}?token=${token}`);
    websocket.current.addEventListener('open', () => setState('ready'));
    websocket.current.addEventListener('close', () => setState(prev => prev === 'error' ? prev : 'closed'));

    websocket.current.addEventListener('message', (event: MessageEvent<string>) => {
      const message = formatWSMessage(event);

      if (message === null) {
        console.error('Websocket message could not be parsed', event);
        return;
      }

      onRecieve(message);
    });

    websocket.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setState('error');
    });
  }, [token, onRecieve]);

  useEffect(() => {
    initialize();

    return () => {
      if (!websocket.current) return;
      websocket.current.close();
    };
  }, [initialize]);

  const onMessage = useCallback(function<T>(message: WSMessage<T>) {
    websocket.current?.send(JSON.stringify(message));
  }, []);

  const onReconnect = () => {
    if (websocket.current) {
      websocket.current.close();
      websocket.current = null;
    }

    initialize();
  };

  return (
    <WebSocketContext.Provider value={{ state, onMessage, onReconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};
