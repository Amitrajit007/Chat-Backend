//  loader socket events
import { Socket, Server } from "socket.io";

import { registerSetUsername } from "./setUsername";
import { registerStartDm } from "./startDm";
import { registerTypeindication } from "./typeIndicator";
import { registerDmMessage } from "./dmMessages";
import { registerDisconnect } from "./disconnect";

export function registerSocketHandler(io: Server, socket: Socket): void {
  socket.data.rate = {
    count: 0,
    lastReset: Date.now(),
    mutedUntil: 0,
  };
  registerSetUsername(io, socket);
  registerStartDm(io, socket);
  registerTypeindication(io, socket);
  registerDmMessage(io, socket);
  registerDisconnect(io, socket);
}
