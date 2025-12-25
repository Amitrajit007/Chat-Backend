import { ChatMessage } from "../src/types/socket";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("set-username", "Dummy-1");
  // connecting at the room
  socket.emit("start-dm", "Dummy-2");
  // sending a msg :
  socket.emit("dm-message", "Hello World! from Dummy-1");
});

socket.on("dm-message", (message: ChatMessage) => {
  console.log(`${message.from} : ${message.text}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected !");
});
