import { MessageModel } from "../model/chat";
import { messageHistoryQuery } from "../../../packages/shared/dist";
import { roomId } from "../utils/roomId";

export const messageHistory = async ({
  from,
  to,
  limit = 10,
}: messageHistoryQuery): Promise<object[]> => {
  try {
    if (!from || !to) {
      throw new Error("from and to are required");
    }

    const room: string = roomId(String(from), String(to)); // getting the roomId
    const msgLimit = Math.min(Number(limit), 25);

    const messages = await MessageModel.find({ roomId: room })
      .sort({ createdAt: -1 })
      .limit(msgLimit)
      .lean();

    return messages.reverse();
  } catch (err) {
    if (err instanceof Error) {
      console.log("Error while showing last messages : ", err.message);
    } else {
      console.log("Error while showing last messages : ", err);
    }
    throw new Error( "initaial Error");
  }
};
