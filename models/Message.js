const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    systemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SystemPrompt",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
