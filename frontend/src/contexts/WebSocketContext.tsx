import { WebSocketState, WSMessage } from '@types';
import { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

const url = `ws://${import.meta.env.API_URL}/ws/v1`;

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
  const websocket = useRef<WebSocket>(null);
  const [state, setState] = useState<WebSocketState>('loading');

  const initialize = useCallback(() => {
    if (websocket.current) return;

    setState('loading');
    websocket.current = new WebSocket(url);
    websocket.current.addEventListener('open', () => setState('ready'));
    websocket.current.addEventListener('close', () => setState(prev => prev === 'error' ? prev : 'closed'));

    websocket.current.addEventListener('message', (event) => {
      console.log('Message received:', event.data);
    });

    websocket.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setState('error');
    });
  }, []);

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
