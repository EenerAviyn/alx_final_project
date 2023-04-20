import "reflect-metadata";
import { createConnection } from "typeorm";
import { port } from './config';
import app from './app';
import 'websocket'
import * as WebSocket from "ws";

const wss = new WebSocket.Server({ port: 9000 });

wss.on("connection", (ws) => {
  console.log("Client connected")
    ws.on("message", (message) => {
        wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
});

createConnection().then(async connection => {
  app.listen(port);
  console.log(`Express server has started on port ${port}.`);
}).catch(error => console.log(error));
