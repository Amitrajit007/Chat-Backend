import { Server, Socket } from "socket.io";

import { MessageModel } from "../model/chat";

import { ChatMessage } from "../../../packages/shared/dist";
import { roomId } from "../utils/roomId";
import { now } from "../utils/time";

export function registerDmMessage(io: Server, socket: Socket) {
  socket.on("dm-message", async (text: string) => {
    const room: string = socket.data.currentRoom;
    const NOW = Date.now();
    const rate = socket.data.rate;
    if (NOW < rate.mutedUntil) {
      socket.emit("dm-error", "You are temporarily muted");
      return;
    }

    if (NOW - rate.lastReset > 60_000) {
      rate.count = 0;
      rate.lastReset = NOW;
    }

    rate.count++;

    if (rate.count > 3) {
      rate.mutedUntil = NOW + 5000; // 5 sec mute
      socket.emit("dm-error", "Too many messages. Muted for 5s.");
      return;
    }

    // VALIDATION -

    if (
      text.toLocaleLowerCase().includes("war") ||
      text.toLocaleLowerCase().includes("gun")
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
}
