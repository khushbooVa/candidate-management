const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Candidate = require('../src/models/Candidate');

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '699971d876c8566761309b30';
        const candidate = await Candidate.findById(id);
        if (candidate) {
            console.log(`Candidate found: ${candidate.name} (${candidate.email})`);
        } else {
            console.log(`Candidate NOT found for ID: ${id}`);
            const all = await Candidate.find({}).limit(5);
            console.log("Current IDs in DB:");
            all.forEach(c => console.log(`- ${c._id}`));
        }
        process.exit(0);
    } catch (error) {
        console.error("Check failed:", error);
        process.exit(1);
    }
};

check();
