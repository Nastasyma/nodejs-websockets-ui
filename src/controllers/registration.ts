import { db } from '../db';
import { NewPlayer } from '../handlers/player';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

export const regPlayer = (name: string, password: string, ws: WebSocketClient) => {
  const { addPlayer } = db;

  const player = new NewPlayer(name, password);
  const { index } = player;
  addPlayer(player);

  ws.index = index;
  ws.name = name;

  ws.send(
    JSON.stringify({
      type: MESSAGE_TYPES.REGISTRATION,
      data: JSON.stringify({
        name,
        index,
        error: false,
        errorText: '',
      }),
      id: 0,
    })
  );
};
