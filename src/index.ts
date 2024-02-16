import { httpServer } from './http_server/index';
import WebSocket from 'ws';
import { router } from './router';
import { WebSocketClient } from './types/interfaces';
import { HTTP_PORT, WS_PORT } from './utils/constants';

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
    console.log(`Message received: ${message}`);
    router(message, ws);
  });

  ws.on('close', () => {
    console.log(`Client numbers: ${wss.clients.size}`);
    console.log('Client disconnected!');
  });
});
