import { WebSocket } from 'ws';
import { Game } from '../db/game';

export interface WebSocketClient extends WebSocket {
  index: number;
  name: string;
}

export interface IMessage {
  type: string;
  data: string;
  id: number;
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

export interface IGame {
  gameId: number;
  players: IGamePlayer[];
  currentPlayer: 0 | 1;
  ships: {
    [key: string]: Game;
  };
  withBot?: boolean;
}

export interface IGamePlayer {
  name: string;
  index: number;
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: string;
}

export interface ITile {
  x: number;
  y: number;
}

export interface IWinner {
  name: string;
  wins: number;
}
