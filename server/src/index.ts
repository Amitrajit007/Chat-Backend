import "dotenv/config";
// types

import type { ChatMessage } from "../../packages/shared/dist";

// import utils
import { now } from "./utils/time";
import { roomId } from "./utils/roomId";
// imports
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

// for data base connection
import { connectDb } from "./config/dbConnection";

// for data base models.
import { MessageModel } from "./model/chat";

// ENVs
const PORT = process.env.PORT || 5000;

// declarations------
const app = express(); //request handler
const server = createServer(app); //real HTTP server
const io = new Server(server); //WebSocket layer attached to that server

const onlineUser = new Map<string, string>(); // username -> socket.id

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// connecting with tha database
async function bootstrap() {
  try {
    await connectDb();
  } catch (err) {
    if (err instanceof Error) {
      console.error("startup failed with : ", err.message);
    } else {
      console.error("startup failed with : ", err);
    }
    process.exit(1); // crash fast
  }
}
bootstrap();

// starting route
app.get("/", (req: Request, res: Response) => {
  res.json({ msg: `Active @ ${PORT}` });
});

// health -online check
app.get("/health", (req: Request, res: Response) => {
  res.send("OK");
});

// route for showing the last messages from the database
app.get("/lastmessages", async (req: Request, res: Response) => {
  try {
    const { from, to, limit = "10" } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "from and to are required" });
    }

    const room: string = roomId(String(from), String(to)); // getting the roomId
    const msgLimit = Math.min(Number(limit), 25);

    const messages = await MessageModel.find({ roomId: room })
      .sort({ createdAt: -1 })
      .limit(msgLimit)
      .lean();

    messages.reverse();

    res.status(200).json({
      messages, // raw json
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error while showing last messages : ", err.message);
    } else {
      console.log("Error while showing last messages : ", err);
    }
  }
});
// dm room name

function dmRoom(userA: string, userB: string) {
  return `dm:${[userA, userB].sort().join("_")}`;
}

io.on("connection", (socket: Socket) => {
  // adding username to the connections @ sockect.on("set-username")
  socket.on("set-username", (username: string) => {
    socket.data.username = username;
    // adding the name and the sockect id to the Map
    onlineUser.set(username, socket.id);

    io.emit("online-users", [...onlineUser.keys()]);
    if ([...onlineUser.keys()].length !== 0) {
      console.log("Online : ", [...onlineUser.keys()]);
    }
  });
  //creating the
  // now adding the room with unique names

  socket.on("start-dm", (target: string) => {
    const myUsername: string = socket.data.username;
    socket.data.target = target;
    if (!myUsername) return;

    const room = dmRoom(myUsername, target);
    socket.join(room);
    socket.data.currentRoom = room;

    console.log(`${myUsername} is connected in romm : ${room}`);
  });
  // console.log("a user connected: ", socket.id);
  // Backend -->  Client
  socket.on("dm-message", async (text: string) => {
    const room = socket.data.currentRoom;
    if (!room) return;

    // VALIDATION -

    if (
      text.toLocaleLowerCase().includes("war") ||
      text.toLocaleLowerCase().includes("hello")
    ) {
      const text: string = "Message is not accepted";
      const message: ChatMessage = {
        roomId: roomId(socket.data.username, socket.data.target),
        id: socket.id,
        from: socket.data.username,
        text,
        time: now(),
      };
      io.to(room).emit("dm-error", message);
      return;
    }
    //sending the msg to all others except the sender
    // socket.broadcast.emit("chat-message", text);

    // creating the complete object for the msg to display
    const message: ChatMessage = {
      roomId: roomId(socket.data.username, socket.data.target),
      id: socket.id,
      from: socket.data.username ?? "Anonymous",
      text,
      time: now(),
    };

    // sending the msg to all including the sender
    io.to(room).emit("dm-message", message);
    await MessageModel.create({
      roomId: roomId(socket.data.username, socket.data.target),
      id: socket.id,
      from: socket.data.username ?? "Anonymous",
      text,
      to: socket.data.target,
      time: now(),
    });
  });

  // when client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnect with id: ", socket.id);
    onlineUser.delete(socket.data.username);
    if ([...onlineUser.keys()].length === 0) {
      console.log("No one is Online");
    } else {
      console.log("Online : ", [...onlineUser.keys()]);
    }
    io.emit("online-users", [...onlineUser.keys()]);
  });
});

server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
