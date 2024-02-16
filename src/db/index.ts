import { IPlayer } from '../types/interfaces';

export class Database {
  players: IPlayer[] = [];
  constructor() {
    this.players = [];
    this.addPlayer = this.addPlayer.bind(this);
  }

  addPlayer(player: IPlayer) {
    this.players.push(player);
    console.log(this.players);
  }
}

export const db = new Database();
