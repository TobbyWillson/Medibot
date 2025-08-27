// routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import { authMiddleware } from "../middleware/auth.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// ✅ Gemini client (via OpenAI SDK, with baseURL pointing to Google)
const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ------------------ SSE Streaming ------------------
const streams = {};

// Start a new stream
router.post("/stream", authMiddleware, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  const streamId = uuidv4();
  streams[streamId] = { message };
  res.json({ streamId });
});

// ✅ Streaming GET route with Gemini
router.get("/stream/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userMessage = streams[id]?.message;
  if (!userMessage) return res.status(404).json({ message: "Stream not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    // Gemini streaming call
    const completion = await gemini.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
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

    // ✅ Save messages to session
    const sessionId = id; // reuse streamId as sessionId
    let chatSession = await Chat.findOne({ userId: req.user.id, sessionId });

    if (!chatSession) {
      chatSession = new Chat({
        userId: req.user.id,
        sessionId,
        messages: [],
      });
    }

    chatSession.messages.push({ role: "user", content: userMessage }, { role: "assistant", content: fullResponse });

    await chatSession.save();

    delete streams[id];
  } catch (err) {
    console.error("SSE streaming error:", err.response?.data || err);
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

// ------------------ Get chat sessions ------------------
router.get("/sessions", authMiddleware, async (req, res) => {
  try {
    // ✅ Fetch only the latest 20 sessions
    const sessions = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(20);

    // Return only metadata for sidebar
    const sidebarData = sessions.map((session) => ({
      sessionId: session.sessionId,
      lastMessage: session.messages.at(-1)?.content || "",
      createdAt: session.createdAt,
    }));

    res.json(sidebarData);
  } catch (err) {
    console.error("Error fetching chat sessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

export default router;
