const { Router } = require("express");
const { getAllSystemPrompts } = require("../controllers/adminController");

const router = Router();
router.get("/", getAllSystemPrompts);

module.exports = router;
