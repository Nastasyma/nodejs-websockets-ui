import { db } from '../db';
import { Game } from '../db/game';
import { MESSAGE_TYPES } from '../types/enums';
import { IMessage, IShip, WebSocketClient } from '../types/interfaces';
import { turn } from './turn';

export const addShips = (gameId: number, ships: IShip[], ws: WebSocketClient) => {
  const { findGame, sockets } = db;
  const game = findGame(gameId);
  if (game) {
    game.ships[ws.index] = new Game(ships);

    const message: IMessage = {
      type: MESSAGE_TYPES.START_GAME,
      data: JSON.stringify({
        ships,
        currentPlayerIndex: ws.index,
      }),
      id: 0,
    };

    sockets[ws.index]!.send(JSON.stringify(message));

    turn(gameId);
  } else {
    console.log('Game not found');
  }
};
