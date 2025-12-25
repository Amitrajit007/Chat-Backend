import "dotenv/config";
// types

import type { ChatMessage } from "./types/socket";

// imports
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";
import { AxiosRequestTransformer } from "axios";
import { on } from "node:process";

// ENVs
const PORT = process.env.PORT || 5000;

// declarations------
const app = express(); //request handler
const server = createServer(app); //real HTTP server
const io = new Server(server); //WebSocket layer attached to that server

// middlewares
app.use(express.json());
app.use(cors());

// basic routes for sanity now
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: `Active @ ${PORT}` });
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// dm room name

function dmRoom(userA: string, userB: string) {
  return `dm:${[userA, userB].sort().join("_")}`;
}

const onlineUser = new Map<string, string>(); // username -> socket.id

io.on("connection", (socket: Socket) => {
  // adding username to the connections @ sockect.on("set-username")
  socket.on("set-username", (username: string) => {
    socket.data.username = username;
    // adding the name and the sockect id to the Map
    onlineUser.set(username, socket.id);

    io.emit("online-users", [...onlineUser.keys()]);

    console.log("Online : ", [...onlineUser.keys()]);
  });
  //creating the
  // now adding the room with unique names

  socket.on("start-dm", (target: string) => {
    const myUsername: string = socket.data.username;
    if (!myUsername) return;

    const room = dmRoom(myUsername, target);
    socket.join(room);
    socket.data.currentRoom = room;

    console.log(`${myUsername} is connected in romm : ${room}`);
  });
  // console.log("a user connected: ", socket.id);

  socket.on("dm-message", (text: string) => {
    const room = socket.data.currentRoom;
    if (!room) return;

    //sending the msg to all others except the sender
    // socket.broadcast.emit("chat-message", text);

    // creating the complete object for the msg to display
    const message: ChatMessage = {
      from: socket.data.username ?? "Anonymous",
      text,
    };

    // sending the msg to all including the sender
    io.to(room).emit("dm-message", message);
  });

  // when client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnect with id: ", socket.id);
    onlineUser.delete(socket.data.username);
    console.log("Online : ", [...onlineUser.keys()]);
    io.emit("online-users", [...onlineUser.keys()]);
  });
});

server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
