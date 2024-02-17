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
  const { findPlayerBySocketName, deleteSocket, deleteRoom, findRoomsByPlayer } = db;
  console.log('Client connected!');

  ws.on('message', (message: string) => {
    console.log(`Message received: ${message}`);
    router(message, ws);
  });

  ws.on('close', () => {
    if (ws.name) {
      const player = findPlayerBySocketName(ws.name);
      if (player) {
        player.online = false;
        const rooms = findRoomsByPlayer(player.name);
        rooms.forEach((room) => {
          deleteRoom(room.roomId);
        });
      }
      deleteSocket(ws.index);
      updateRooms();
      console.log(`Client with name ${ws.name} disconnected!`);
    }
  });
});

process.on('SIGINT', () => {
  wss.close();
  httpServer.close();
  console.log('Server closed!');
  process.exit(0);
});
