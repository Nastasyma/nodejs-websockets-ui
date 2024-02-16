import { WebSocket } from 'ws';

export interface IPlayer {
  index: number;
  name: string;
  password: string;
  online: boolean;
}

export interface WebSocketClient extends WebSocket {
  index: number;
  name: string;
}
