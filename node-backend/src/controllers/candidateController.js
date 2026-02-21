const asyncHandler = require("express-async-handler");
const Candidate = require("../models/Candidate");
const fs = require("fs");
const path = require("path");

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private (HR)
const createCandidate = asyncHandler(async (req, res) => {
    const { name, email, skills, notes } = req.body;

    if (!req.file) {
        res.status(400);
        throw new Error("Please upload a resume");
    }

    const candidateExists = await Candidate.findOne({ email });
    if (candidateExists) {
        res.status(400);
        throw new Error("Candidate already exists with this email");
    }

    const candidate = await Candidate.create({
        name,
        email,
        skills: skills ? skills.split(",").map(skill => skill.trim()) : [],
        resumeUrl: req.file.path,
        notes,
    });

    res.status(201).json(candidate);
});

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private (HR, Interviewer)
const getCandidates = asyncHandler(async (req, res) => {
    const candidates = await Candidate.find({}).sort({ lastUpdated: -1 });
    res.json(candidates);
});

// @desc    Get candidate by id
// @route   GET /api/candidates/:id
// @access  Private (HR, Interviewer)
const getCandidateById = asyncHandler(async (req, res) => {
    const candidate = await Candidate.findById(req.params.id)
        .populate("assignedInterviewer", "email role")
        .populate("feedbackHistory.interviewerId", "email role");

    if (candidate) {
        res.json(candidate);
    } else {
        res.status(404);
        throw new Error("Candidate not found");
    }
});

// @desc    Update candidate stage & add feedback
// @route   PATCH /api/candidates/:id/stage
// @access  Private (HR, Interviewer)
const updateCandidateStage = asyncHandler(async (req, res) => {
    const { stage, status, feedbackText, assignedInterviewer, scheduledTime } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
        if (!feedbackText) {
            res.status(400);
            throw new Error("Feedback is required for stage transition");
        }

        candidate.feedbackHistory.push({
            stage: stage || candidate.currentStage,
            feedbackText,
            interviewerId: req.user._id,
        });

        if (stage) {
            candidate.currentStage = stage;
        }

        if (status) {
            candidate.status = status;
        }

        if (assignedInterviewer || scheduledTime) {
            // If interviewer or time changes, reset status to Pending
            if (assignedInterviewer && assignedInterviewer !== candidate.assignedInterviewer?.toString()) {
                candidate.assignedInterviewer = assignedInterviewer;
                candidate.interviewStatus = "Pending";
            }
            if (scheduledTime && new Date(scheduledTime).getTime() !== candidate.scheduledTime?.getTime()) {
                candidate.scheduledTime = new Date(scheduledTime);
                candidate.interviewStatus = "Pending";
            }
        }

        const { interviewMode, interviewStatus } = req.body;
        if (interviewMode) {
            candidate.interviewMode = interviewMode;
        }
        if (interviewStatus) {
            candidate.interviewStatus = interviewStatus;
        }

        const updatedCandidate = await candidate.save();
        res.json(updatedCandidate);
    } else {
        res.status(404);
        throw new Error("Candidate not found");
    }
});

// @desc    Get dashboard stats
// @route   GET /api/candidates/stats/summary
// @access  Private (HR)
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalCandidates = await Candidate.countDocuments();

    const statsPerStage = await Candidate.aggregate([
        { $group: { _id: "$currentStage", count: { $sum: 1 } } }
    ]);

    const recentlyUpdated = await Candidate.find({})
        .sort({ lastUpdated: -1 })
        .limit(5);

    res.json({
        totalCandidates,
        statsPerStage,
        recentlyUpdated
    });
});

// @desc    Update candidate profile
// @route   PUT /api/candidates/:id
// @access  Private (HR)
const updateCandidate = asyncHandler(async (req, res) => {
    const { name, email, skills, notes } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
        candidate.name = name || candidate.name;
        candidate.email = email || candidate.email;
        candidate.notes = notes || candidate.notes;

        if (skills) {
            candidate.skills = skills.split(",").map(skill => skill.trim());
        }

        // Handle Resume Update
        if (req.file) {
            // Delete old file if it exists
            if (candidate.resumeUrl) {
                const oldPath = path.join(__dirname, "../../", candidate.resumeUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            candidate.resumeUrl = req.file.path;
        }

        const updatedCandidate = await candidate.save();
        res.json(updatedCandidate);
    } else {
        res.status(404);
        throw new Error("Candidate not found");
    }
});

module.exports = {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidateStage,
    updateCandidate,
    getDashboardStats,
};
