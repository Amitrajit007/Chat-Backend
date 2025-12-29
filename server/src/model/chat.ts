import mongoose, { Schema } from "mongoose";

import { ChatMessage } from "../../../packages/shared/dist";

const msgSchema = new Schema({
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
  to: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

msgSchema.index({ roomId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<ChatMessage>("Message", msgSchema);
