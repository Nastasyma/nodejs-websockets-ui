import { db } from '../db';
import { WebSocketClient } from '../types/interfaces';
import { updateRooms } from './updateRoom';

export const createRoom = (ws: WebSocketClient) => {
  const { addRoom } = db;
  addRoom(ws);
  updateRooms();
};
