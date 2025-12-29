import { io } from "socket.io-client";
import readline from "readline";

import {}

const socket = io("http://localhost:5000");

const USERNAME = process.argv[2];
const TARGET = process.argv[3];
// connection error
socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});

// setup readline
const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

socket.on("connect", () => {
  // set username
  socket.emit("set-username", USERNAME);
  // seting the room with the target username
  socket.emit("start-dm", TARGET);
  // sending the msg to the backend through the client
  console.log(`Chatting with ${TARGET}`);
  console.log("Type messages and press Enter...\n");
});

cli.on("line", (line: string) => {
  const text = line.trim();
  if (!text) return;

  socket.emit("dm-message", text);
});

socket.on("dm-message", (message: ChatMessage) => {
  const sender = message.from === USERNAME ? "You" : message.from;
  console.log(
    `(ID : ${message.id}) ${sender} : ${message.text} at ${message.time} `,
  );
});
