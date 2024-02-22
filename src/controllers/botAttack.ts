import { db } from '../db';
import { ATTACK_STATUS, TILE_STATUS } from '../types/enums';
import { ITile } from '../types/interfaces';
import { getRandomNum } from '../utils/randomNum';
import { attackResponse, finishResponse } from '../utils/response';
import { turn } from './turn';
import { addWinnerByName } from './updateWinners';

export const botAttack = (gameId: number, data: string) => {
  const { findGame, findEnemy, findNonBotPlayer } = db;
  const game = findGame(gameId);
  if (!game) return;

  const currentPlayerIndex = game.currentPlayer;
  const eIndex = findEnemy(game, currentPlayerIndex);
  const eBoard = game.ships[eIndex].gameBoard;

  const tiles: ITile[] = [];

  eBoard.forEach((row, x) => {
    row.forEach((tile, y) => {
      if (!tile.checked) {
        tiles.push({ x, y });
      }
    });
  });

  if (tiles.length > 0) {
    const randomNum = getRandomNum(0, tiles.length - 1);
    const { x, y } = tiles[randomNum];
    console.log('Bot attack tile:', { x, y });
    console.log('attack', data);
    const { findGame, findEnemy, sockets } = db;
    const { gameId, indexPlayer } = JSON.parse(data);
    const game = findGame(gameId);

    if (game.players[game.currentPlayer].index !== indexPlayer) return;

    const eIndex = findEnemy(game, indexPlayer);
    const ship = game.ships[eIndex];

    if (!ship || ship.gameBoard[x][y].checked) return;

    const attackResult = ship.handleAttack(x, y);
    const { status, tilesAround } = attackResult;

    const sendResponse = (status: ATTACK_STATUS, x: number, y: number, index: number) => {
      const message = attackResponse(status, x, y, index);
      sockets[eIndex].send(message);
    };

    if (status === ATTACK_STATUS.KILLED) {
      sendResponse(ATTACK_STATUS.KILLED, x, y, -1);
      tilesAround?.forEach(([x, y]) => {
        sendResponse(ATTACK_STATUS.MISS, x, y, -1);
      });
      if (ship.gameBoard.flat().every((tile) => tile.status !== TILE_STATUS.SHIP)) {
        console.log(`THE GAME #${gameId} IS OVER!`);
        const nonBotPlayer = findNonBotPlayer(game);
        if (nonBotPlayer) {
          sockets[nonBotPlayer.index].send(finishResponse(-1));
        }
        addWinnerByName('bot');
        return;
      }
    } else {
      sendResponse(status, x, y, -1);
    }
    turn(gameId, status);
  }
};
