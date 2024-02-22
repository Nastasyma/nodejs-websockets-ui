import { db } from '../db';
import { IGame, WebSocketClient } from '../types/interfaces';
import { createGameResponse } from '../utils/response';
import { updateRooms } from './updateRoom';

export const singlePlay = (ws: WebSocketClient) => {
  const { rooms, deleteRoom, addRoom } = db;
  const room = addRoom(ws);
  if (room) {
    room.roomUsers.push({ name: 'bot', index: -1 });
  }
  updateRooms();
  // console.log('rooms', db.rooms);
  const gameId = room.roomId;
  const game: IGame = {
    gameId,
    players: [],
    ships: {},
    currentPlayer: 0,
    withBot: true,
  };

  game.players.push({ index: ws.index, name: ws.name }, { index: -1, name: 'bot' });

  const roomsToDelete = rooms.filter((r) => r.roomUsers.some((user) => user.index === ws.index));
  roomsToDelete.forEach((room) => deleteRoom(room.roomId));

  updateRooms();

  const message = createGameResponse(gameId, ws.index);
  db.sockets[ws.index].send(message);

  db.addGame(game);
  console.log(`THE GAME #${gameId} IS CREATED`);
};
