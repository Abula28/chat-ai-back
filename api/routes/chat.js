import express from "express";
import { body, param } from "express-validator";
import {
  createSession,
  getSessionMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Create new session
router.post("/session", createSession);

// Get session messages
router.get(
  "/session/:id/messages",
  param("id").isMongoId(),
  getSessionMessages
);

// Send message and get AI response
router.post(
  "/chat",
  body("sessionId").isMongoId(),
  body("content").notEmpty(),
  sendMessage
);

export default router;
