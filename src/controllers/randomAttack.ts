import { db } from '../db';
import { attack } from './attack';
import { ITile, WebSocketClient } from '../types/interfaces';
import { getRandomNum } from '../utils/randomNum';

export const randomAttack = (data: string, ws: WebSocketClient) => {
  // console.log('randomAttack', data);
  const { gameId, indexPlayer } = JSON.parse(data);
  const { findGame, findEnemy } = db;
  const game = findGame(gameId);

  if (!game) return;

  const eIndex = findEnemy(game, indexPlayer);
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
    // console.log(`#${indexPlayer} player random attack:`, { x, y });
    attack(
      JSON.stringify({
        gameId,
        x,
        y,
        indexPlayer: ws.index,
      }),
      ws
    );
  }
};
