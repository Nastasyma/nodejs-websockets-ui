import { db } from '../db';
import { NewPlayer } from '../db/player';
import { WebSocketClient } from '../types/interfaces';
import { registrationResponse } from '../utils/response';
import { updateRooms } from './updateRoom';
import { updateWinners } from './updateWinners';

export const regPlayer = (name: string, password: string, ws: WebSocketClient) => {
  const { addPlayer, findPlayer, setSocket } = db;
  const existingPlayer = findPlayer(name);
  // console.log('existingPlayer', existingPlayer);

  if (existingPlayer) {
    const response =
      existingPlayer.password !== password
        ? { error: true, errorText: 'Incorrect password' }
        : existingPlayer.online
          ? { error: true, errorText: `User ${name} is already logged in` }
          : { index: existingPlayer.index, name, error: false, errorText: '' };

    if (!existingPlayer.online && response.error !== true) {
      existingPlayer.online = true;
      ws.index = existingPlayer.index;
      ws.name = name;
      setSocket(ws, existingPlayer.index);
    }
    ws.send(registrationResponse(name, existingPlayer.index, response.error, response.errorText));
    updateRooms();
    updateWinners();
  } else {
    const player = new NewPlayer(name, password);
    const { index } = player;
    addPlayer(player);
    setSocket(ws, index);
    player.online = true;
    ws.index = index;
    ws.name = name;
    ws.send(registrationResponse(name, index, false, ''));
    updateRooms();
    updateWinners();
  }

  // console.log('Players', db.players);
};
