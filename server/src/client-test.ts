import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("connected with ID : ", socket.id);

  // sending a msg :
  socket.emit("chat-message", "Hello World! from dummy 1 ");
});

socket.on("chat-message", (text: string) => {
  console.log("recieved msg : ", text);
});

socket.on("disconnect", () => {
  console.log("Disconnected !");
});
