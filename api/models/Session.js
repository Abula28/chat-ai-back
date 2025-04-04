import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", sessionSchema);
