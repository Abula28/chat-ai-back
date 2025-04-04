import Session from "../models/Session.js";
import Message from "../models/Message.js";
import SystemPrompt from "../models/SystemPrompt.js";

// Middleware to check admin authentication
export const isAdmin = (req, res, next) => {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
};

// Get all sessions
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific session messages
export const getSessionDetails = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current system prompt
export const getSystemPrompt = async (req, res) => {
  try {
    const prompt = await SystemPrompt.findOne().sort({ createdAt: -1 });
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update system prompt
export const updateSystemPrompt = async (req, res) => {
  try {
    const prompt = new SystemPrompt({
      content: req.body.content,
    });
    await prompt.save();
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
