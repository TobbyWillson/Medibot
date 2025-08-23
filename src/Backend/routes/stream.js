// routes/stream.js
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import OpenAI from "openai";
import Chat from "../models/Chat.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// SSE Streaming endpoint
router.get("/stream/:chatId", authMiddleware, async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.write("data: ⚠️ Chat not found\n\n");
      return res.end();
    }

    let aiText = "";

    // Streaming with async iterator (OpenAI SDK v4+)
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Medibot, a helpful medical assistant." },
        { role: "user", content: chat.prompt },
      ],
      stream: true,
    });

    try {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          aiText += content;
          res.write(`data: ${content}\n\n`);
        }
      }
    } catch (chunkErr) {
      console.error("Chunk streaming error:", chunkErr);
      res.write("data: ⚠️ Error during streaming\n\n");
    }

    // Finish SSE
    res.write("data: [DONE]\n\n");
    res.end();

    // Save AI response to DB
    chat.response = aiText;
    chat.userId = req.user.id; // optional: link to authenticated user
    await chat.save();
  } catch (err) {
    console.error("SSE route error:", err);
    res.write("data: ⚠️ Something went wrong\n\n");
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;
