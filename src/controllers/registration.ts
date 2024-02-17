import { db } from '../db';
import { NewPlayer } from '../db/player';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

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
          : { online: true, index: existingPlayer.index, name, error: false, errorText: '' };

    if (!existingPlayer.online && response.error !== true) {
      existingPlayer.online = true;
      ws.index = existingPlayer.index;
      ws.name = name;
      setSocket(ws, existingPlayer.index);
    }

    ws.send(
      JSON.stringify({ type: MESSAGE_TYPES.REGISTRATION, data: JSON.stringify(response), id: 0 })
    );
  } else {
    const player = new NewPlayer(name, password);
    const { index } = player;
    addPlayer(player);
    setSocket(ws, index);
    player.online = true;
    ws.index = index;
    ws.name = name;

    ws.send(
      JSON.stringify({
        type: MESSAGE_TYPES.REGISTRATION,
        data: JSON.stringify({ name, index, error: false, errorText: '' }),
        id: 0,
      })
    );
  }

  // console.log('Players', db.players);
};
