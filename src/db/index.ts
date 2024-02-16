import { IPlayer, IRoom, ISocket, WebSocketClient } from '../types/interfaces';

export class Database {
  socket: ISocket;
  players: IPlayer[];
  rooms: IRoom[];
  roomId: number;
  constructor() {
    this.socket = {};
    this.players = [];
    this.rooms = [];
    this.roomId = 0;
  }

  addPlayer = (player: IPlayer) => {
    this.players.push(player);
  };

  findPlayer = (name: string) => {
    return this.players.find((player) => player.name === name);
  };

  addRoom = (ws: WebSocketClient) => {
    const newRoom: IRoom = {
      roomId: ++this.roomId,
      roomUsers: [{ name: ws.name, index: ws.index }],
    };
    this.rooms.push(newRoom);
    return newRoom;
  };

  setSocket = (ws: WebSocketClient, index: number) => {
    this.socket[index] = ws;
  };
}

export const db = new Database();
