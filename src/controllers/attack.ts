import { WebSocketClient } from '../types/interfaces';

export const attack = (data: string, ws: WebSocketClient) => {
  console.log('attack', data + ' ' + ws.name);
};
