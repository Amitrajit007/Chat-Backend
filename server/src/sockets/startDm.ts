import { Server, Socket } from "socket.io";

function dmRoom(userA: string, userB: string) {
  return `dm:${[userA, userB].sort().join("")}`;
}

export function registerStartDm(io: Server, socket: Socket) {
  socket.on("start-dm", (target: string) => {
    const myUsername: string = socket.data.username;
    socket.data.target = target;
    if (!myUsername) return;

    const room = dmRoom(myUsername, target);
    socket.join(room);
    socket.data.currentRoom = room;

    console.log(`${myUsername} is connected in romm : ${room}`);
  });
}
