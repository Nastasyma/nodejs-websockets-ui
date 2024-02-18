import { IGame, IPlayer, IRoom, ISocket, WebSocketClient } from '../types/interfaces';

export class Database {
  sockets: ISocket;
  players: IPlayer[];
  rooms: IRoom[];
  roomId: number;
  games: IGame[];
  constructor() {
    this.sockets = {};
    this.players = [];
    this.rooms = [];
    this.roomId = 0;
    this.games = [];
  }

  addPlayer = (player: IPlayer) => {
    this.players.push(player);
  };

  findPlayer = (name: string) => {
    return this.players.find((player) => player.name === name);
  };

  setSocket = (ws: WebSocketClient, index: number) => {
    this.sockets[index] = ws;
  };

  deleteSocket = (index: number) => {
    delete this.sockets[index];
  };

  findPlayerBySocketName = (name: string) => {
    return this.players.find((player) => player.name === name);
  };

  findRoomsByPlayer = (name: string) => {
    return this.rooms.filter((room) => room.roomUsers.some((user) => user.name === name));
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

  addGame = (game: IGame) => {
    this.games.push(game);
  };

  findGame = (gameId: number) => this.games.find((game) => game.gameId === gameId)!;
}

export const db = new Database();
