import { regPlayer } from '../controllers/registration';
import { MESSAGE_TYPES } from '../types/enums';
import { WebSocketClient } from '../types/interfaces';

export const router = (message: string, ws: WebSocketClient) => {
  try {
    const data = JSON.parse(message);

    switch (data.type) {
      case MESSAGE_TYPES.REGISTRATION:
        const parsedData = JSON.parse(data.data);
        const { name, password } = parsedData;
        regPlayer(name, password, ws);
        break;
      default:
        console.log('Unknown message type');
    }
  } catch (error) {
    console.log(error);
  }
};
