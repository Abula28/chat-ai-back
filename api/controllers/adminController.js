import Session from "../models/Session.js";
import Message from "../models/Message.js";
import SystemPrompt from "../models/SystemPrompt.js";

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const getSystemPrompt = async (req, res) => {
  try {
    const prompts = await SystemPrompt.find().sort({ createdAt: -1 });
    res.json({
      status: "success",
      message: "Prompts fetched successfully",
      prompts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSystemPrompt = async (req, res) => {
  try {
    const prompt = await SystemPrompt.create(req.body);
    res.json({
      status: "success",
      message: "System prompt created successfully",
      prompt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateSystemPrompt = async (req, res) => {
  try {
    const prompt = await SystemPrompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!prompt) {
      return res.status(404).json({ error: "System prompt not found" });
    }

    res.json(prompt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
