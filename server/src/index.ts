import "dotenv/config";
// imports
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

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

io.on("connection", (socket: Socket) => {
  console.log("a user connected: ", socket.id);

  socket.on("chat-message", (text: string) => {
    console.log("message recieved: ", text);

    //sending the msg to all others
    socket.broadcast.emit("chat-message", text);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnect with id: ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
