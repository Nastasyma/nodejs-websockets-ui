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

  setSocket = (ws: WebSocketClient, index: number) => {
    this.socket[index] = ws;
  };

  addRoom = (ws: WebSocketClient) => {
    const newRoom: IRoom = {
      roomId: ++this.roomId,
      roomUsers: [{ name: ws.name, index: ws.index }],
    };
    this.rooms.push(newRoom);
    return newRoom;
  };

  deleteRoom = (index: number) => (this.rooms = this.rooms.filter((room) => room.roomId !== index));
}

export const db = new Database();
