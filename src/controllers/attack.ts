import { db } from '../db';
import { ATTACK_STATUS } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';
import { attackResponse } from '../utils/response';
import { turn } from './turn';

export const attack = (data: string, ws: WebSocketClient) => {
  console.log('attack', data);
  const { findGame, findEnemy, sockets } = db;
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game = findGame(gameId);

  if (game.players[game.currentPlayer].index !== indexPlayer) return;

  const eIndex = findEnemy(game, indexPlayer);
  const ship = game.ships[eIndex];

  if (!ship || ship.gameBoard[x][y].checked) return;

  const attackResult = ship.handleAttack(x, y);
  const { status, tilesAround } = attackResult;
  // console.log('status', status);
  // console.log('tilesAround', tilesAround);
  // console.log('gameBoard', ship.gameBoard);

  const sendResponse = (status: ATTACK_STATUS, x: number, y: number, index: number) => {
    const message = attackResponse(status, x, y, index);
    sockets[index].send(message);
    sockets[eIndex].send(message);
  };

  if (status === ATTACK_STATUS.KILLED) {
    sendResponse(ATTACK_STATUS.KILLED, x, y, ws.index);
    tilesAround?.forEach(([x, y]) => {
      sendResponse(ATTACK_STATUS.MISS, x, y, ws.index);
    });
  } else {
    sendResponse(status, x, y, ws.index);
  }

  console.log('status', status);
  turn(gameId, status);
};