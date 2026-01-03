import { Server, Socket } from "socket.io";
export function registerTypeindication(io: Server, socket: Socket): void {
  socket.on("typing", () => {
    const room: string = socket.data.currentRoom;
    const userName: string = socket.data.username;
    socket.to(room).emit("typing", userName);
  });
}
