import "dotenv/config";

import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors);

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: `Hello World from ${PORT}` });
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
});
server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
