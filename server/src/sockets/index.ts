//  loader socket events
import { Socket, Server } from "socket.io";

import { registerSetUsername } from "./setUsername";
import { registerDmMessage } from "./dmMessages";
import { registerStartDm } from "./startDm";
import { registerDisconnect } from "./disconnect";

export function registerSocketHandler(io: Server, socket: Socket) {
  socket.data.rate = {
    count: 0,
    lastReset: Date.now(),
    mutedUntil: 0,
  };
  registerSetUsername(io, socket);
  registerStartDm(io, socket);
  registerDmMessage(io, socket);
  registerDisconnect(io, socket);
}
