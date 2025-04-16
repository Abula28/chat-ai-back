import Session from "../models/Session.js";
import Message from "../models/Message.js";
import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import SystemPrompt from "../models/SystemPrompt.js";

const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});
config();

export const createSession = async (req, res) => {
  try {
    const { title } = req.body;
    const session = new Session({
      userId: req.user._id,
      title: title || "New Chat",
    });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      sessionId: req.params.id,
    }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, content, systemId } = req.body;

    const systemPrompt = await SystemPrompt.findById(systemId);
    if (!systemPrompt) {
      return res.status(404).json({ error: "System prompt not found" });
    }

    const history = await Message.find({ sessionId }).sort({ createdAt: 1 });

    const chatHistory = history.map((msg) => ({
      role: msg.sender,
      content: msg.content,
    }));

    const messages = [
      new SystemMessage(systemPrompt.content),
      ...chatHistory.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      ),
      new HumanMessage(content),
    ];

    const response = await model.invoke(messages);
    const aiResponse = response.content;

    await Message.create({ sessionId, sender: "user", content, systemId });
    await Message.create({
      sessionId,
      sender: "assistant",
      content: aiResponse,
      systemId,
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
