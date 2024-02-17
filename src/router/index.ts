import { addPlayerToRoom } from '../controllers/addPlayerToRoom';
import { createRoom } from '../controllers/createRoom';
import { regPlayer } from '../controllers/registration';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

export const router = (message: string, ws: WebSocketClient) => {
  try {
    const { type, data } = JSON.parse(message);

    switch (type) {
      case MESSAGE_TYPES.REGISTRATION:
        const parsedData = JSON.parse(data);
        const { name, password } = parsedData;
        regPlayer(name, password, ws);
        break;
      case MESSAGE_TYPES.CREATE_ROOM:
        createRoom(ws);
        break;
      case MESSAGE_TYPES.ADD_USER_TO_ROOM:
        const indexRoom = JSON.parse(data).indexRoom;
        addPlayerToRoom(indexRoom, ws);
        break;
      default:
        console.log('Unknown message type');
    }
  } catch (error) {
    console.log(error);
  }
};
