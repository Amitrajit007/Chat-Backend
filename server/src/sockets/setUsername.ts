import { Server, Socket } from "socket.io";

import { onlineUser } from "./presence.state";
export function registerSetUsername(io: Server, socket: Socket) {
  socket.on("set-username", (username: string) => {
    socket.data.username = username;
    // Join a personal room with the username for direct notifications
    socket.join(username);
    // adding the name and the sockect id to the Map
    onlineUser.set(username, socket.id);

    io.emit("online-users", [...onlineUser.keys()]);
    if ([...onlineUser.keys()].length !== 0) {
      console.log("Online : ", [...onlineUser.keys()]);
    }
  });
}
