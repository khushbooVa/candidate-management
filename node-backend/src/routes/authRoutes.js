const express = require("express");
const { loginUser, registerUser, getInterviewers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
console.log(">>> [AUTH] Registering GET /interviewers...");
router.get("/interviewers", protect, authorize("HR"), getInterviewers);

module.exports = router;
