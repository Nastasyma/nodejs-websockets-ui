import { db } from '../db';
import { MESSAGE_TYPES } from '../types/enums';

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
