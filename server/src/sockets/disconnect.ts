import { Server, Socket } from "socket.io";
import { onlineUser } from "./presence.state";
export function registerDisconnect(io: Server, socket: Socket) {
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
}
