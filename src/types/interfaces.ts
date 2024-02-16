import { WebSocket } from 'ws';

export interface IPlayer {
  index: number;
  name: string;
  password: string;
}

export interface WebSocketClient extends WebSocket {
  index: number;
  name: string;
  id: number;
}
