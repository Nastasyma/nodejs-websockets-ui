import { db } from '../db';
import { WebSocketClient } from '../types/interfaces';
import { updateRooms } from './updateRoom';

export const createRoom = (ws: WebSocketClient) => {
  const { findRoomsByPlayer, addRoom, findPlayerBySocketName } = db;
  const player = findPlayerBySocketName(ws.name);

  if (player) {
    const existingRooms = findRoomsByPlayer(player.name);
    if (existingRooms.length === 0) {
      addRoom(ws);
      updateRooms();
    } else {
      console.log(`Player ${ws.name} already has a room`);
    }
  } else {
    console.log(`Player ${ws.name} not found`);
  }
};
