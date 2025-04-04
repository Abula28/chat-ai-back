import Session from "../models/Session.js";
import Message from "../models/Message.js";
import OpenAI from "openai";
import { config } from "dotenv";
config();
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create new session
export const createSession = async (req, res) => {
  try {
    const session = new Session({
      userId: req.body.userId || "anonymous",
    });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get session messages
export const getSessionMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, content } = req.body;

    // Save user message
    const userMessage = new Message({
      sessionId,
      sender: "user",
      content,
    });
    await userMessage.save();

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    const assistantMessage = new Message({
      sessionId,
      sender: "assistant",
      content: aiResponse,
    });
    await assistantMessage.save();

    res.json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
