// models/Chat.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
});

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError
const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
