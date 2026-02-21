const express = require("express");
const router = express.Router();
const {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidateStage,
    updateCandidate,
    getDashboardStats,
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/stats/summary", protect, getDashboardStats);
router.put("/:id", protect, authorize("HR"), upload.single("resume"), updateCandidate);
router.get("/", protect, getCandidates);
router.post("/", protect, authorize("HR"), upload.single("resume"), createCandidate);
router.get("/:id", protect, getCandidateById);
router.patch("/:id/stage", protect, updateCandidateStage);

module.exports = router;
