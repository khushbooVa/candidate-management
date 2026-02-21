const Candidate = require("../models/Candidate");

/**
 * Super simple NLP-style search service
 * Parses queries like "show candidates in L1" or "find react developers"
 */
const searchCandidates = async (queryText) => {
    const query = queryText.toLowerCase();
    let filter = {};

    // 1. Status Detection
    if (query.includes("rejected") || query.includes("discarded") || query.includes("reject")) {
        filter.status = "Rejected";
    } else {
        filter.status = "Active";
    }

    // 2. Stage Detection
    const stages = ["screening", "l1", "l2", "director", "hr", "compensation", "bg check", "offer"];
    const foundStage = stages.find(s => query.includes(s));

    if (foundStage) {
        const stageMap = {
            "screening": "Screening",
            "l1": "L1",
            "l2": "L2",
            "director": "Director",
            "hr": "HR",
            "compensation": "Compensation",
            "bg check": "BG Check",
            "offer": "Offer"
        };
        filter.currentStage = stageMap[foundStage];
    }

    // 3. Skill Detection
    const skillsKeywords = [
        "react", "node", "javascript", "python", "java", "css", "html", "mongodb",
        "frontend", "backend", "fullstack", "devops", "aws", "docker"
    ];
    const foundSkills = skillsKeywords.filter(s => query.includes(s));

    if (foundSkills.length > 0) {
        filter.skills = { $in: foundSkills.map(s => new RegExp(s, 'i')) };
    }

    // 4. Name or Global Search
    if (!foundStage && foundSkills.length === 0) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { "skills": { $regex: query, $options: 'i' } }
        ];
    }

    return await Candidate.find(filter).sort({ lastUpdated: -1 });
};

module.exports = { searchCandidates };
