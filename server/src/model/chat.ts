import mongoose, { Schema } from "mongoose";

import { ChatMessage } from "../types/socket";

const msgSchema = new Schema<ChatMessage>({
  roomId: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },

  from: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

export const MessageModel = mongoose.model<ChatMessage>("Message", msgSchema);
