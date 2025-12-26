import { ChatMessage } from "../src/types/socket";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
let myUserName: string = "Anonymous";

socket.on("connect", () => {
  socket.emit("set-username", "Dummy-1");
  myUserName = "Dummy-1";
  // connecting at the room
  socket.emit("start-dm", "Dummy-2");
  // sending a msg :
  socket.emit("dm-message", "Good morinig! from Dummy-1");
});

socket.on("online-users", (users: string[]) => {
  console.log("online:", users);
});

socket.on("dm-message", (message: ChatMessage) => {
  const sender = message.from === myUserName ? "You" : message.from;
  console.log(
    `(ID : ${message.id}) ${sender} : ${message.text} at ${message.time} `,
  );
});

// handling the error event

socket.on("dm-error", (msg: ChatMessage) => {
  const sender = msg.from === myUserName ? "You" : msg.from;
  console.log(`(ID : ${msg.id}) ${sender} : ${msg.text} at ${msg.time} `);
});

socket.on("disconnect", () => {
  console.log("Disconnected. ");
});
