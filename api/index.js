import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Abula AI API is running");
});

const port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
