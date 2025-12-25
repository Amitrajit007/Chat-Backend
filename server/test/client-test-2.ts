import { ChatMessage } from "../src/types/socket";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("set-username", "Dummy 2");

  // console.log("connected with ID : ", socket.id);

  // sending a msg :
  socket.emit("chat-message", "Hello World!  👋👋 ");
});

socket.on("chat-message", (message: ChatMessage) => {
  console.log(`${message.from} : ${message.text}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected !");
});
