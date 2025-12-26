import { ChatMessage } from "../src/types/socket";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

let myUserName: string = "Anonymous";

socket.on("connect", () => {
  socket.emit("set-username", "Dummy-2");
  // console.log("connected with ID : ", socket.id); however this is so much unpredictable to create any dm room or any kind of room.
  myUserName = "Dummy-2";
  // connecting to the other user
  socket.emit("start-dm", "Dummy-1");
  // sending a msg :
  socket.emit("dm-message", `hello from ${myUserName}`);
});

socket.on("online-users", (users: string[]) => {
  console.log("online:", users);
});

socket.on("dm-message", (message: ChatMessage) => {
  const sender = message.from === myUserName ? "You" : message.from;
  console.log(`(ID : ${msg.id}) ${sender} : ${msg.text} at ${msg.time} `);
});

socket.on("dm-error", (msg: ChatMessage) => {
  const sender = msg.from === myUserName ? "You" : msg.from;
  console.log(`(ID : ${msg.id}) ${sender} : ${msg.text} at ${msg.time} `);
});

socket.on("disconnect", () => {
  console.log("Disconnected.");
});
