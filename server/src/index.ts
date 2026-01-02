import "dotenv/config";

// imports
import { registerSocketHandler } from "./sockets/index";
import router from "./routes/messageHistory.route";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

// for data base connection
import { connectDb } from "./config/dbConnection";

// ENVs
const PORT = process.env.PORT || 5000;

// declarations------
const app = express(); //request handler
const server = createServer(app); //real HTTP server
const io = new Server(server); //WebSocket layer attached to that server

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

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

io.on("connection", (socket: Socket) => {
  registerSocketHandler(io, socket);
});

server.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
