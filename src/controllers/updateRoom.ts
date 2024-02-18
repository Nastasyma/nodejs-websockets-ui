import { db } from '../db';
import { MESSAGE_TYPES } from '../types/enums';

export const updateRooms = () => {
  const { sockets, rooms } = db;

  Object.keys(sockets).forEach((key) =>
    sockets[key].send(
      JSON.stringify({
        type: MESSAGE_TYPES.UPDATE_ROOM,
        data: JSON.stringify(rooms),
        id: 0,
      })
    )
  );
};
