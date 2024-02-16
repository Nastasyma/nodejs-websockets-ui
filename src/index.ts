import { httpServer } from './http_server/index';
import WebSocket from 'ws';
import { router } from './router';
import { WebSocketClient } from './types/interfaces';
import { HTTP_PORT, WS_PORT } from './utils/constants';
import { db } from './db';
import { updateRooms } from './controllers/updateRoom';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocket.Server({
  port: WS_PORT,
  host: 'localhost',
});

wss.on('listening', () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

wss.on('connection', (ws: WebSocketClient) => {
  console.log('Client connected!');

  ws.on('message', (message: string) => {
    // console.log(`Message received: ${message}`);
    router(message, ws);
  });

  ws.on('close', () => {
    console.log(`Client with name ${ws.name} disconnected!`);

    if (ws.name) {
      const player = db.findPlayerBySocketName(ws.name);
      if (player) {
        player.online = false;
        const rooms = db.findRoomsByPlayer(player.name);
        rooms.forEach((room) => {
          db.deleteRoom(room.roomId);
        });
      }
      db.deleteSocket(ws.index);
      updateRooms();
    }
  });
});

process.on('SIGINT', () => {
  wss.close();
  httpServer.close();
  console.log('Server closed!');
  process.exit(0);
});
