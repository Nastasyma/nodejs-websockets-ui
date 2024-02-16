import { db } from '../db';
import { MESSAGE_TYPES } from '../types/enums';
import { IMessage, WebSocketClient } from '../types/interfaces';
import { updateRooms } from './updateRoom';

export const addPlayerToRoom = (data: string, ws: WebSocketClient) => {
  const { rooms, players, socket, deleteRoom } = db;
  const indexRoom = JSON.parse(data).indexRoom;
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

    roomUsers.forEach(({ index }) => {
      const newMessage: IMessage = {
        type: MESSAGE_TYPES.CREATE_GAME,
        data: JSON.stringify({
          idGame: roomId,
          idPlayer: index,
        }),
        id: 0,
      };
      socket[index].send(JSON.stringify(newMessage));
    });
  }
};
