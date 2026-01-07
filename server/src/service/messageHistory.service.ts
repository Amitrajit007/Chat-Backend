import { MessageModel } from "../model/chat";
import { messageHistoryQuery } from "../../../packages/shared/dist";
import { roomId } from "../utils/roomId";
import { createClient } from "redis";
const redisClient = createClient();
redisClient.on("error", (err) => console.log("Redis error : ", err));
redisClient.connect();
const DEFAULTEXPIRATION = 60 * 60;
export const messageHistory = async ({
  from,
  to,
  limit = 10,
}: messageHistoryQuery): Promise<object[]> => {
  try {
    if (!from || !to) {
      throw new Error("from and to are required");
    }
    const room: string = roomId(String(from), String(to));
    const msgLimit = Math.min(Number(limit), 25);

    const cacheKey = `${room}:${msgLimit}`;

    const cached = await redisClient.get(cacheKey);
    if (cached != null) {
      console.log("Cache hit");
      return JSON.parse(cached);
    } else {
      console.log("Cache miss");
      const messages = await MessageModel.find({ roomId: room })
        .sort({ createdAt: -1 })
        .lean();
      const recentMessages = messages.reverse();
      const messageHistory = recentMessages.splice(0, msgLimit).reverse();
      redisClient.setEx(
        cacheKey,
        DEFAULTEXPIRATION,
        JSON.stringify(messageHistory),
      );
      return messageHistory;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error while showing last messages : ", err.message);
    } else {
      console.log("Error while showing last messages : ", err);
    }
    throw new Error("initaial Error");
  }
};
