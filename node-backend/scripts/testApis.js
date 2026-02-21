const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testCandidateId = '';

const logger = (msg, data = '') => {
    console.log(`\n[\x1b[34mTEST\x1b[0m] ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
};

const runTests = async () => {
    try {
        console.log("\x1b[32m--- STARTING API TEST SUITE ---\x1b[0m");

        // 1. Login Admin
        logger("Testing Auth: Login Admin");
        let loginRes;
        try {
            loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@talenthub.com',
                password: '123456'
            });
        } catch (err) {
            logger("Login failed, attempting auto-registration...");
            await axios.post(`${BASE_URL}/auth/register`, {
                email: 'admin@talenthub.com',
                password: '123456',
                role: 'HR'
            });
            loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@talenthub.com',
                password: '123456'
            });
        }

        authToken = loginRes.data.token;
        logger("Login Success!", { email: loginRes.data.email, role: loginRes.data.role });

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        // 2. Create Candidate (Multipart)
        logger("Testing Candidate: Create New Candidate");
        const form = new FormData();
        form.append('name', 'Test Engineer');
        form.append('email', `test.${Date.now()}@example.com`);
        form.append('skills', 'Node.js, React, Testing');
        form.append('notes', 'Automated test candidate');

        // Use a small text file as a dummy resume if it doesn't exist
        const dummyResumePath = path.join(__dirname, 'dummy_resume.pdf');
        fs.writeFileSync(dummyResumePath, 'This is a test resume content.');
        form.append('resume', fs.createReadStream(dummyResumePath));

        const createRes = await axios.post(`${BASE_URL}/candidates`, form, {
            headers: {
                ...config.headers,
                ...form.getHeaders()
            }
        });
        testCandidateId = createRes.data._id;
        logger("Candidate Created!", createRes.data);

        // 3. Get All Candidates
        logger("Testing Candidate: Get All Candidates");
        const allCandidatesRes = await axios.get(`${BASE_URL}/candidates`, config);
        logger(`Fetched ${allCandidatesRes.data.length} candidates`);

        // 4. Get Candidate by ID
        logger("Testing Candidate: Get Candidate Details");
        const detailRes = await axios.get(`${BASE_URL}/candidates/${testCandidateId}`, config);
        logger("Candidate Detail:", detailRes.data);

        // 5. Update Stage with Feedback
        logger("Testing Candidate: Transition to L1 Stage");
        const stageRes = await axios.patch(`${BASE_URL}/candidates/${testCandidateId}/stage`, {
            stage: 'L1',
            feedbackText: 'Great initial screening performance.'
        }, config);
        logger("Stage Updated!", { newStage: stageRes.data.currentStage, historyCount: stageRes.data.feedbackHistory.length });

        // 6. Test NLP Search
        logger("Testing Search: 'Show L1 candidates'");
        const searchRes = await axios.get(`${BASE_URL}/search?q=Show L1 candidates`, config);
        logger(`Search Results (${searchRes.data.length} found):`, searchRes.data.map(c => c.name));

        // 7. Get Dashboard Stats
        logger("Testing Stats: Dashboard Summary");
        const statsRes = await axios.get(`${BASE_URL}/candidates/stats/summary`, config);
        logger("Dashboard Stats:", statsRes.data);

        console.log("\n\x1b[32m--- ALL TESTS PASSED SUCCESSFULLY ---\x1b[0m");

        // Cleanup dummy resume
        fs.unlinkSync(dummyResumePath);

    } catch (error) {
        console.error("\x1b[31m\n--- TEST FAILED ---\x1b[0m");
        if (error.response) {
            console.error("Error Status:", error.response.status);
            console.error("Error Data:", error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
};

runTests();
