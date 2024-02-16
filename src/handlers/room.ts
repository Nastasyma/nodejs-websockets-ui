import { db } from '../db';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

export const createRoom = (ws: WebSocketClient) => {
  const { addRoom } = db;
  addRoom(ws);
  updateRooms();
};

export const updateRooms = () => {
  const { socket, rooms } = db;

  Object.keys(socket).forEach((key) =>
    socket[key].send(
      JSON.stringify({
        type: MESSAGE_TYPES.UPDATE_ROOM,
        data: JSON.stringify(rooms),
        id: 0,
      })
    )
  );
};
