import mongoose from "mongoose";

const systemPromptSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["system", "persona", "tool", "assistant", "default"],
      default: "default",
    },
    label: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model("SystemPrompt", systemPromptSchema);
