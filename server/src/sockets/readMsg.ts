import { Server, Socket } from "socket.io";

import { MessageModel } from "../model/chat";
export function registerRead(io: Server, socket: Socket) {
  socket.on("message-read", async ({ messageId, from }) => {
    await MessageModel.updateOne(
      { _id: messageId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } },
    );

    io.to(from).emit("read", messageId);
  });
}
