import { WebSocket } from 'ws';

export interface WebSocketClient extends WebSocket {
  index: number;
  name: string;
}

export interface IPlayer {
  index: number;
  name: string;
  password: string;
  online: boolean;
}

export interface IRoom {
  roomId: number;
  roomUsers: IRoomUser[];
}

export interface IRoomUser {
  name: string;
  index: number;
}

export interface ISocket {
  [key: string]: WebSocketClient;
}
