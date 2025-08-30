// server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cookieParser());

// CORS: allow your Vercel site + localhost
const allowed = [process.env.FRONTEND_URL, "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowed.some((a) => a && (a === origin || (a instanceof RegExp && a.test(origin))))) return cb(null, true);
      // allow all *.vercel.app previews (optional, handy)
      if (/\.vercel\.app$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ------------------ Middlewares ------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Test Route ------------------
app.get("/test", (req, res) => res.send("Server is working!"));

app.get("/", (req, res) => res.send("Medibot backend is running 🚀"));

// ------------------ MongoDB Setup ------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medibot", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/test-mongo", async (req, res) => {
  try {
    const dbList = await mongoose.connection.db.admin().listDatabases();
    res.json({ databases: dbList.databases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ Chat Schema ------------------
const chatSchema = new mongoose.Schema({
  user: { type: String, default: "Anonymous" },
  message: { type: String, required: true },
  response: { type: String },
  createdAt: { type: Date, default: Date.now },
});
const Chat = mongoose.model("Chat", chatSchema);

// ------------------  Gemini Setup ------------------
const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// ------------------ Memory store for SSE ------------------
const streams = {};

// Step 1: Receive user message and create a stream ID
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const streamId = uuidv4();
  streams[streamId] = { message };

  res.json({ streamId });
});

// Step 2: Stream AI response via SSE
app.get("/api/chat/stream/:id", async (req, res) => {
  const { id } = req.params;
  const userMessage = streams[id]?.message;

  if (!userMessage) return res.status(404).json({ error: "Stream not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Gemini streaming call
    const completion = await gemini.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: "You are Medibot, a healthcare assistant. Provide safe medical information and health advice, but do not replace a doctor.",
        },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    let fullResponse = "";

    // Stream chunks to client
    for await (const chunk of completion) {
      console.log("SSE chunk:", JSON.stringify(chunk, null, 2));
      const content = chunk.choices[0]?.delta?.content || chunk.choices?.[0]?.message?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${content}\n\n`);
      }
    }

    // Send DONE event
    res.write("data: [DONE]\n\n");
    res.end();

    // Save chat to DB
    const newChat = new Chat({
      message: userMessage,
      response: fullResponse,
    });
    await newChat.save();

    // Clean up memory
    delete streams[id];
  } catch (err) {
    console.error("OpenAI SSE error:", err);
    res.write("data: ⚠️ Something went wrong\n\n");
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// ------------------ Auth Routes ------------------
app.use("/api/auth", authRoutes);

// ------------------ Start Server ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Medibot server running on port ${PORT}`));
