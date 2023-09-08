const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://192.168.1.218:8000",
  },
  connectTimeout: 1000,
});

io.on("connection", (socket) => {
  console.log("socket 连接成功");
  socket.on("message", (obj) => {
    io.emit("message", obj);
  });
  socket.on("sendMessage", (data) => {
    // 广播除自己以外其他客户端
    socket.broadcast.emit("sendMessage", data);
  });
});

httpServer.listen(3000, () => {
  console.log("server start, port: 3000");
});
