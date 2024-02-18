import { TILE_STATUS } from '../types/enums';
import { IShip } from '../types/interfaces';
import { Board } from './board';

export class Game {
  ships: IShip[];
  gameBoard: Board[][];

  constructor(ships: IShip[]) {
    this.ships = ships;
    this.gameBoard = this.createGameBoard();
  }

  createGameBoard = () => {
    const board: Board[][] = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => new Board(0, 0, TILE_STATUS.EMPTY))
    );

    this.ships.forEach(({ position, direction, length }) => {
      const { x, y } = position;
      for (let i = 0; i < length; i++) {
        const [cellX, cellY] = direction ? [x, y + i] : [x + i, y];
        board[cellX][cellY].status = TILE_STATUS.SHIP;
      }
    });

    return board;
  };
}
