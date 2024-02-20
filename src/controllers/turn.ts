import { db } from '../db';
import { ATTACK_STATUS } from '../types/enums';
import { turnResponse } from '../utils/response';

export const turn = (gameId: number, status?: string) => {
  const { findGame, sockets } = db;
  const game = findGame(gameId);
  const { currentPlayer } = game;

  game.currentPlayer =
    status === ATTACK_STATUS.MISS ? (currentPlayer === 0 ? 1 : 0) : currentPlayer;

  game.players.forEach((player) => {
    const currentPlayer = game.players[game.currentPlayer].index;
    const message = turnResponse(currentPlayer);
    sockets[player.index].send(message);
  });
};
