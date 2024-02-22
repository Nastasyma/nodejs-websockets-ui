import { db } from '../db';
import { ATTACK_STATUS, TILE_STATUS } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';
import { attackResponse, finishResponse } from '../utils/response';
import { turn } from './turn';
import { addWinnerByName } from './updateWinners';

export const attack = (data: string, ws: WebSocketClient) => {
  // console.log('attack', data);
  const { findGame, findEnemy, sockets, findNonBotPlayer } = db;
  const { gameId, x, y, indexPlayer } = JSON.parse(data);
  const game = findGame(gameId);
  if (!game) return;
  if (game.players[game.currentPlayer].index !== indexPlayer) return;

  const eIndex = findEnemy(game, indexPlayer);
  const ship = game.ships[eIndex];

  if (!ship || ship.gameBoard[x][y].checked) return;

  const attackResult = ship.handleAttack(x, y);
  const { status, tilesAround } = attackResult;

  const sendResponse = (status: ATTACK_STATUS, x: number, y: number, index: number) => {
    const message = attackResponse(status, x, y, index);
    sockets[index].send(message);
    if (!game.withBot) {
      sockets[eIndex].send(message);
    }
  };

  if (status === ATTACK_STATUS.KILLED) {
    sendResponse(ATTACK_STATUS.KILLED, x, y, ws.index);
    tilesAround?.forEach(([x, y]) => {
      sendResponse(ATTACK_STATUS.MISS, x, y, ws.index);
    });

    if (ship.gameBoard.flat().every((tile) => tile.status !== TILE_STATUS.SHIP)) {
      console.log(`THE GAME #${gameId} IS OVER!`);
      if (!game.withBot) {
        game.players.forEach((player) => {
          const message = finishResponse(ws.index);
          sockets[player.index].send(message);
        });
      } else {
        const nonBotPlayer = findNonBotPlayer(game);
        console.log('nonBotPlayer', nonBotPlayer);
        if (nonBotPlayer) {
          sockets[nonBotPlayer.index].send(finishResponse(ws.index));
        }
      }
      addWinnerByName(ws.name);
      // console.log('winners', db.winners);
      return;
    }
  } else {
    sendResponse(status, x, y, ws.index);
  }
  // console.log('status', status);
  turn(gameId, status);
};
