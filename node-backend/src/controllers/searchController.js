const asyncHandler = require("express-async-handler");
const { searchCandidates } = require("../services/aiSearchService");

// @desc    NLP based search
// @route   GET /api/search
// @access  Private
const nlpSearch = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        res.status(400);
        throw new Error("Search query is required");
    }

    const results = await searchCandidates(q);
    res.json(results);
});

module.exports = { nlpSearch };
