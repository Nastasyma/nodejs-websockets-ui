import { db } from '../db';
import { IGame, WebSocketClient } from '../types/interfaces';
import { createGameResponse } from '../utils/response';
import { updateRooms } from './updateRoom';

export const addPlayerToRoom = (indexRoom: number, ws: WebSocketClient) => {
  const { rooms, players, sockets, deleteRoom, addGame } = db;
  const player = players.find((p) => p.index === ws.index);
  const room = rooms.find((r) => r.roomId === indexRoom);

  if (!rooms.length || !player || !room) return;

  const { roomId, roomUsers } = room;
  const { name } = player;

  if (roomUsers.length < 2 && !roomUsers.some((user) => user.index === ws.index)) {
    roomUsers.push({ name, index: ws.index });
    db.rooms = rooms.filter((r) => r.roomId !== roomId);

    const roomsToDelete = rooms.filter((r) => r.roomUsers.some((user) => user.index === ws.index));
    roomsToDelete.forEach((room) => deleteRoom(room.roomId));

    updateRooms();

    const gameId = room.roomId;
    const game: IGame = {
      gameId,
      players: [],
      ships: {},
      currentPlayer: 0,
      withBot: false,
    };

    roomUsers.forEach(({ index, name }) => {
      game.players.push({ index, name });

      const message = createGameResponse(gameId, index);
      sockets[index].send(message);
      console.log('Message sent:', message);
    });

    addGame(game);
    console.log(`THE GAME #${gameId} IS CREATED`);
  }
};
