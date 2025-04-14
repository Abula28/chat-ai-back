import express from "express";
import { body, param } from "express-validator";
import {
  createSession,
  getSessionMessages,
  sendMessage,
} from "../controllers/chatController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/session", checkAuth, createSession);

router.get(
  "/session/:id/messages",
  checkAuth,
  param("id").isMongoId(),
  getSessionMessages
);

router.post(
  "/chat",
  checkAuth,
  // body("sessionId").isMongoId(),
  // body("content").notEmpty(),
  sendMessage
);

export default router;
