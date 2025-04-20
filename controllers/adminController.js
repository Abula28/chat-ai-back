import Session from "../models/Session.js";
import Message from "../models/Message.js";
import SystemPrompt from "../models/SystemPrompt.js";

export const getAllMessages = async (req, res) => {
  try {
    const { sender } = req.query;

    let queryStr = {};
    if (sender) {
      queryStr["sender"] = sender;
    }

    const messages = await Message.find(queryStr)
      .sort({ createdAt: 1 })
      .populate({
        path: "sessionId",
        populate: {
          path: "userId",
          select: "username",
        },
      })
      .lean();

    const flattenedMessages = messages.map((e) => ({
      _id: e._id,
      systemId: e.systemId,
      sessionId: e.sessionId?._id,
      sender: e.sender,
      content: e.content,
      username: e.sessionId?.userId?.username || null,
      createdAt: e.createdAt,
    }));

    res.json({
      status: "success",
      message: "Messages fetched successfully",
      messages: flattenedMessages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res
        .status(404)
        .json({ status: "fail", message: "Message not found" });
    }

    res.json({
      status: "success",
      message: "Message deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate({
        path: "userId",
        select: "username",
      })
      .sort({ createdAt: -1 });

    const flattenedSessions = sessions.map((e) => ({
      _id: e._id,
      userId: e.userId?._id,
      username: e.userId?.username,
      title: e.title,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));

    res.json({
      status: "success",
      message: "Sessions fetched successfully",
      sessions: flattenedSessions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return res
        .status(404)
        .json({ status: "fail", message: "Session not found" });
    }

    await Message.deleteMany({ sessionId: id });

    res.json({
      status: "success",
      message: "Session and related messages deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSystemPrompts = async (req, res) => {
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
      return res
        .status(404)
        .json({ status: "fail", message: "System prompt not found" });
    }

    res.json({
      status: "success",
      message: "System prompt updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSystemPrompt = async (req, res) => {
  try {
    const { id } = req.params;
    const prompt = await SystemPrompt.findByIdAndDelete(id);

    if (!prompt) {
      return res.status(404).json({ error: "System prompt not found" });
    }

    res.json({
      status: "success",
      message: "System prompt deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
