import { IPlayer } from '../types/interfaces';

export class Database {
  players: IPlayer[] = [];
  constructor() {
    this.players = [];
    this.addPlayer = this.addPlayer.bind(this);
    this.findPlayer = this.findPlayer.bind(this);
  }

  addPlayer(player: IPlayer) {
    this.players.push(player);
  }

  findPlayer(name: string) {
    return this.players.find((player) => player.name === name);
  }
}

export const db = new Database();
