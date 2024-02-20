import { WebSocketClient } from '../types/interfaces';

export const randomAttack = (data: string, ws: WebSocketClient) => {
  console.log('randomAttack', data + ' ' + ws.name);
};
