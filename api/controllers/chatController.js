import Session from "../models/Session.js";
import Message from "../models/Message.js";
import OpenAI from "openai";
import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import SystemPrompt from "../models/SystemPrompt.js";

const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});
config();

export const createSession = async (req, res) => {
  try {
    const session = new Session({
      userId: req.user._id,
    });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.id }).sort({
      createdAt: 1,
    });
    res.json(messages);
  } catch (error) {
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

    const systemMessage = new SystemMessage(systemPrompt.content);
    const userMessage = new HumanMessage(content);

    const messages = [systemMessage, userMessage];

    const response = await model.invoke(messages);

    const aiResponse = response.content;

    await Message.create({
      sessionId,
      sender: "user",
      content,
      systemId,
    });

    await Message.create({
      sessionId,
      sender: "assistant",
      content: aiResponse,
      systemId,
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
