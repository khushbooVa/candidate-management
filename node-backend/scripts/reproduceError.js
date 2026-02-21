const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const run = async () => {
    try {
        // 1. Login to get token
        console.log("Logging in as Interviewer...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'interviewer@talenthub.com',
            password: '123456'
        });
        const token = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get a candidate ID
        console.log("Fetching candidates...");
        const candidates = await axios.get(`${BASE_URL}/candidates`, config);
        if (candidates.data.length === 0) throw new Error("No candidates found");
        const candidateId = candidates.data[0]._id;

        // 3. Attempt updateStage like the frontend does
        console.log(`Attempting update for candidate ${candidateId}...`);
        const res = await axios.patch(`${BASE_URL}/candidates/${candidateId}/stage`, {
            interviewStatus: 'Accepted',
            feedbackText: 'Interviewer marked the interview as Accepted.'
        }, config);

        console.log("SUCCESS:", res.data.interviewStatus);

    } catch (error) {
        console.error("FAILED!");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error:", error.message);
        }
    }
};

run();
