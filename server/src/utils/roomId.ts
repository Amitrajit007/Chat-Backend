export function roomId(userA: string, userB: string): string {
  const roomId: string = [userA, userB].sort().join();
  return roomId;
}