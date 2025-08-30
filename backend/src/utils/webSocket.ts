// webSocket.ts
import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 8080 });

const webSocketConnect = () => {

  wss.on('connection', function connection(ws) {
    console.log('Client connected', ws);
    console.log('WebSocket server is running on ws://localhost:8080');

    ws.on('message', function incoming(message) {
      console.log('Received:', message);

      // Echo back to client
      ws.send(`Server received: ${message}`);
    });

    ws.send('Hello from server!');
  });

}

export default webSocketConnect;