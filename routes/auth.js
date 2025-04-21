const { Router } = require("express");
const {
  login,
  register,
  userCheckIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { checkAuth } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/check-in", checkAuth, userCheckIn);

module.exports = router;
