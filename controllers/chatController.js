const Session = require("../models/Session");
const Message = require("../models/Message");
const { config } = require("dotenv");
const { ChatOpenAI } = require("@langchain/openai");
const {
  HumanMessage,
  SystemMessage,
  AIMessage,
} = require("@langchain/core/messages");
const SystemPrompt = require("../models/SystemPrompt");

const model = new ChatOpenAI({
  model: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});
config();

const createSession = async (req, res) => {
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

const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await Session.aggregate([
      { $match: { userId: req.user._id } },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "sessionId",
          as: "lastMessage",
        },
      },
      {
        $addFields: {
          lastMessageDate: {
            $ifNull: [{ $max: "$lastMessage.createdAt" }, "$createdAt"],
          },
        },
      },
      { $sort: { lastMessageDate: -1 } },
    ]);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSessionMessages = async (req, res) => {
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

const sendMessage = async (req, res) => {
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

module.exports = {
  createSession,
  getSessionsByUser,
  getSessionMessages,
  sendMessage,
};
