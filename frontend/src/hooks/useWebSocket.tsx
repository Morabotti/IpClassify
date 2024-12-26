import { use } from 'react';
import { WebSocketContext } from '@contexts/WebSocketContext';

export const useWebSocket = () => use(WebSocketContext);
