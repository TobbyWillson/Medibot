// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
