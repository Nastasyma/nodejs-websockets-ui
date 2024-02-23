import { httpServer } from './http_server/index';
import WebSocket from 'ws';
import { router } from './router';
import { WebSocketClient } from './types/interfaces';
import { HTTP_PORT, WS_PORT } from './utils/constants';
import { db } from './db';
import { updateRooms } from './controllers/updateRoom';
import { addWinnerByName } from './controllers/updateWinners';
import { finishResponse } from './utils/response';

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wss = new WebSocket.Server({
  port: WS_PORT,
  host: 'localhost',
});

wss.on('listening', () => {
  console.log(`Start websocket server on the ${WS_PORT} port!`);
});

wss.on('error', (error) => {
  console.log(`Error: ${error.message}`);
});

wss.on('connection', (ws: WebSocketClient) => {
  const {
    sockets,
    findPlayerBySocketName,
    deleteSocket,
    deleteRoom,
    deleteGame,
    findRoomsByPlayer,
    findGamesByPlayer,
  } = db;
  console.log('Client connected!');

  ws.on('message', (message: string) => {
    console.log(`Message received: ${message}`);
    router(message, ws);
  });

  ws.on('close', () => {
    if (ws.name) {
      const player = findPlayerBySocketName(ws.name);
      if (!player) return;

      player.online = false;
      const games = findGamesByPlayer(player.name);
      const rooms = findRoomsByPlayer(player.name);

      if (!rooms || !games) return;

      rooms.forEach((room) => {
        deleteRoom(room.roomId);
      });

      games.forEach((game) => {
        const enemy = game.players.find((p) => p.index !== player?.index);
        const eIndex = enemy?.index;
        if (!game.withBot) {
          game.players.forEach((player) => {
            const newMessage = finishResponse(eIndex!);
            sockets[player.index].send(newMessage);
          });
          console.log(`THE GAME #${game.gameId} IS OVER! The winner is ${enemy?.name}`);
          if (enemy) {
            const winnerName = enemy.name;
            addWinnerByName(winnerName);
          }
        }
        deleteGame(game.gameId);
      });

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
