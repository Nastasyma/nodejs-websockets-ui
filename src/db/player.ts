import { IPlayer } from '../types/interfaces';

export class NewPlayer implements IPlayer {
  static index = 0;
  index: number;
  name: string;
  password: string;
  online: boolean;

  constructor(name: string, password: string) {
    this.index = NewPlayer.getIndexAndIncrement();
    this.name = name;
    this.password = password;
    this.online = false;
  }

  static getIndexAndIncrement() {
    const currentIndex = NewPlayer.index;
    NewPlayer.index += 1;
    return currentIndex;
  }
}
