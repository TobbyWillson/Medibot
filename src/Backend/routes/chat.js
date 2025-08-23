// routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import { authMiddleware } from "../middleware/auth.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ------------------ Normal Chat POST ------------------
router.post("/", authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Medibot, a helpful medical assistant." },
        { role: "user", content: message },
      ],
    });

    const aiReply = completion.choices[0]?.message?.content || "No response";

    const newChat = await Chat.create({
      userId: req.user.id,
      prompt: message,
      response: aiReply,
    });

    res.status(201).json({ reply: aiReply, chatId: newChat._id });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ message: "AI failed to respond" });
  }
});

// ------------------ SSE Streaming ------------------
const streams = {};

router.post("/stream", authMiddleware, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  const streamId = uuidv4();
  streams[streamId] = { message };
  res.json({ streamId });
});

// ✅ Updated streaming GET route
router.get("/stream/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userMessage = streams[id]?.message;
  if (!userMessage) return res.status(404).json({ message: "Stream not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    // OpenAI streaming call
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Medibot, a helpful medical assistant." },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    // Loop through streamed events
    for await (const event of completion) {
      const delta = event.choices?.[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${delta}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

    // Save chat in DB
    await Chat.create({
      userId: req.user.id,
      prompt: userMessage,
      response: fullResponse,
    });

    delete streams[id];
  } catch (err) {
    console.error("SSE streaming error:", err);
    res.write("data: ⚠️ Something went wrong\n\n");
    res.end();
  }
});

// ------------------ Get all user chats ------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("Fetch chats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
