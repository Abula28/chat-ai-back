const express = require("express");
const { body, param } = require("express-validator");
const {
  createSession,
  getSessionMessages,
  getSessionsByUser,
  sendMessage,
} = require("../controllers/chatController");
const { checkAuth } = require("../middlewares/authMiddleware");

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

module.exports = router;
