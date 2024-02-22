import { db } from '../db';
import { Game } from '../db/game';
import { IShip, WebSocketClient } from '../types/interfaces';
import { botShips } from '../utils/botShips';
import { startGameResponse } from '../utils/response';
import { turn } from './turn';

export const addShips = (gameId: number, ships: IShip[], ws: WebSocketClient) => {
  const { findGame, sockets } = db;
  const game = findGame(gameId);
  if (game) {
    game.ships[ws.index] = new Game(ships);
    const message = startGameResponse(ships, ws.index);
    sockets[ws.index]!.send(message);
    if (game.withBot) {
      game.ships[-1] = new Game(botShips);
    }
    console.log('game', game);
    turn(gameId);
  } else {
    console.log('Game not found');
  }
};
