const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const server = app.listen(8080, () => {
  console.log("server start");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`message=>${message}`);
    console.log(JSON.parse(message).text);

    wss.clients.forEach((client) => {
      console.log(client === ws);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log("send");
        client.send(message);
      }
    });
  });
});
