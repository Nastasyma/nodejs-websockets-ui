import { db } from '../db';
import { updateRoomsResponse } from '../utils/response';

export const updateRooms = () => {
  const { sockets, rooms } = db;

  Object.keys(sockets).forEach((key) => sockets[key].send(updateRoomsResponse(rooms)));
};
