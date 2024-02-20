import { db } from '../db';
import { ATTACK_STATUS, MESSAGE_TYPES } from '../types/enums';
import { IMessage } from '../types/interfaces';

export const turn = (gameId: number, status?: string) => {
  const { findGame, sockets } = db;
  const game = findGame(gameId);
  const { currentPlayer } = game;

  game.currentPlayer =
    status === ATTACK_STATUS.MISS ? (currentPlayer === 0 ? 1 : 0) : currentPlayer;

  game.players.forEach((player) => {
    const message: IMessage = {
      type: MESSAGE_TYPES.TURN,
      data: JSON.stringify({
        currentPlayer: game.players[game.currentPlayer].index,
      }),
      id: 0,
    };
    sockets[player.index].send(JSON.stringify(message));
  });
};
