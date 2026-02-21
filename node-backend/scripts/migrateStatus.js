const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Candidate = require('../src/models/Candidate');

dotenv.config({ path: path.join(__dirname, '../.env') });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("[\x1b[34mDB\x1b[0m] Connected for migration");

        const result = await Candidate.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'Active' } }
        );

        console.log(`\x1b[32m[SUCCESS] Updated ${result.modifiedCount} candidates with status: 'Active'\x1b[0m`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
