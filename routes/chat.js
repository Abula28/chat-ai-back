import express from "express";
import { body, param } from "express-validator";
import {
  createSession,
  getSessionMessages,
  getSessionsByUser,
  sendMessage,
} from "../controllers/chatController.js";
import { checkAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/session", checkAuth, createSession);

router.get("/sessions", checkAuth, getSessionsByUser);

router.get(
  "/session/:id/messages",
  checkAuth,
  param("id").isMongoId(),
  getSessionMessages
);

router.post(
  "/",
  checkAuth,
  body("sessionId").isMongoId(),
  body("content").notEmpty(),
  sendMessage
);

export default router;
