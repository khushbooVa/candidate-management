const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
    stage: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const candidateSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        resumeUrl: {
            type: String,
            required: true,
        },
        currentStage: {
            type: String,
            enum: [
                "Screening",
                "L1",
                "L2",
                "Director",
                "HR",
                "Compensation",
                "BG Check",
                "Offer"
            ],
            default: "Screening",
        },
        status: {
            type: String,
            enum: ["Active", "Rejected", "Joined"],
            default: "Active",
        },
        assignedInterviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        scheduledTime: {
            type: Date,
        },
        interviewMode: {
            type: String,
            enum: ["Virtual", "In-person"],
        },
        interviewStatus: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
        feedbackHistory: [feedbackSchema],
        notes: {
            type: String,
            default: "",
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Update lastUpdated on save
candidateSchema.pre("save", function (next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model("Candidate", candidateSchema);
