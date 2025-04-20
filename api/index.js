const express = require("express");
const { config } = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const chatRoutes = require("../routes/chat");
const adminRoutes = require("../routes/admin");
const authRoutes = require("../routes/auth");
const knowledgeRoutes = require("../routes/knowledge");

config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/knowledge", knowledgeRoutes);

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
