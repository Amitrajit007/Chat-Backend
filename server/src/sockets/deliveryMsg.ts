import { Server, Socket } from "socket.io";

import { MessageModel } from "../model/chat";
export function registerDelivered(io: Server, socket: Socket) {
  socket.on("message-delivered", async ({ messageId, from }) => {
    await MessageModel.updateOne(
      { _id: messageId, deliveredAt: { $exists: false } },
      { $set: { deliveredAt: new Date() } },
    );

    io.to(from).emit("delivered", messageId);
  });
}
