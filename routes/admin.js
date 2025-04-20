const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllSessions,
  updateSystemPrompt,
  createSystemPrompt,
  getAllMessages,
  deleteMessage,
  deleteSession,
  getAllSystemPrompts,
} = require("../controllers/adminController");
const { checkAuth, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/messages", checkAuth, isAdmin, getAllMessages);
router.delete("/message/:id", checkAuth, isAdmin, deleteMessage);

router.get("/sessions", checkAuth, isAdmin, getAllSessions);
router.delete("/session/:id", checkAuth, isAdmin, deleteSession);

router.get("/prompts", checkAuth, isAdmin, getAllSystemPrompts);
router.post("/prompt", checkAuth, isAdmin, createSystemPrompt);

router.put(
  "/prompt/:id",
  checkAuth,
  isAdmin,
  body("content").notEmpty(),
  updateSystemPrompt
);

module.exports = router;
