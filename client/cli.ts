import { io } from "socket.io-client";
import readline from "readline";

import type { ChatMessage } from "../packages/shared/dist";

const socket = io("http://localhost:5000");

function showTyping(username: string) {
  process.stdout.write(`\r${username} is typing...`);
}

function clearTyping() {
  process.stdout.write("\r\x1b[K");
}

const USERNAME = process.argv[2].toLocaleLowerCase();
const TARGET = process.argv[3].toLocaleLowerCase();
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
socket.on("online-users", (users: string[]) => {
  const onlineUsers = users.map((user, index) =>
    user === USERNAME ? "You" : user,
  );
  console.log("online:", onlineUsers);
});

process.stdin.on("data", () => {
  socket.emit("typing");
});
cli.on("line", (line: string) => {
  const text = line.trimEnd();
  if (!text) return;

  socket.emit("dm-message", text);
});

socket.on("typing", (userName: string) => {
  showTyping(userName);
  setTimeout(() => {
    clearTyping();
  }, 1000);
});

socket.on("dm-message", (message: ChatMessage) => {
  clearTyping();
  const sender = message.from === USERNAME ? "You" : message.from;
  console.log(`${sender} : ${message.text}          ${message.time} `);
});

// handle errors
socket.on("dm-error", (err) => {
  console.log("Error:", err);
});

// cleanup
socket.on("disconnect", () => {
  console.log("Disconnected");
  process.exit(0);
});

cli.on("SIGINT", () => {
  console.log("\nCaught Ctrl+C");
  cli.close();
});

cli.on("close", () => {
  console.log("Closing connection...");
  socket.disconnect();
  process.exit(0);
});
