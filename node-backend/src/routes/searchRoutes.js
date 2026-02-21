const express = require("express");
const { nlpSearch } = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, nlpSearch);

module.exports = router;
