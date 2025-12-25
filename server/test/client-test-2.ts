import { ChatMessage } from "../src/types/socket";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  socket.emit("set-username", "Dummy-2");
  // console.log("connected with ID : ", socket.id); however this is so much unpredictable to create any dm room or any kind of room.
  const myUserName: string = "Dummy-2";
  // connecting to the other user
  socket.emit("start-dm", "Dummy-1");
  // sending a msg :
  socket.emit("dm-message", `hello from ${myUserName}`);
});

socket.on("dm-message", (message: ChatMessage) => {
  console.log(`${message.from} : ${message.text}`);
});

socket.on("disconnect", () => {
  console.log("Disconnected !");
});
