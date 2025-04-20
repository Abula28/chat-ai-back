const { Router } = require("express");
const {
  login,
  register,
  userCheckIn,
} = require("../controllers/authController");
const { checkAuth } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-in", checkAuth, userCheckIn);

module.exports = router;
