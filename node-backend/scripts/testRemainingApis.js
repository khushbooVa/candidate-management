const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

const logger = (msg, data = '') => {
    console.log(`\n[\x1b[34mEXTRA-TEST\x1b[0m] ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
};

const runTests = async () => {
    try {
        console.log("\x1b[32m--- STARTING REMAINING APIS TEST SUITE ---\x1b[0m");

        // 1. Login Admin
        logger("Logging in as Admin...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@talenthub.com',
            password: '123456'
        });
        authToken = loginRes.data.token;
        const config = { headers: { Authorization: `Bearer ${authToken}` } };

        // 2. Test Get Interviewers
        logger("Testing Auth: Get All Interviewers");
        const interviewersRes = await axios.get(`${BASE_URL}/auth/interviewers`, config);
        logger(`Fetched ${interviewersRes.data.length} interviewers`, interviewersRes.data.map(i => i.email));

        // 3. Test Update Candidate Profile (PUT)
        // First get one candidate to update
        const candidates = await axios.get(`${BASE_URL}/candidates`, config);
        const targetId = candidates.data[0]._id;

        logger(`Testing Candidate: Update Profile for ID ${targetId}`);
        const updateForm = new FormData();
        updateForm.append('name', 'Updated Test Name');
        updateForm.append('skills', 'Senior Node, React Expert');

        // Dummy resume for update
        const dummyPath = path.join(__dirname, 'update_resume.pdf');
        fs.writeFileSync(dummyPath, 'Updated resume contents');
        updateForm.append('resume', fs.createReadStream(dummyPath));

        const updateRes = await axios.put(`${BASE_URL}/candidates/${targetId}`, updateForm, {
            headers: {
                ...config.headers,
                ...updateForm.getHeaders()
            }
        });
        logger("Profile Updated!", { name: updateRes.data.name, skills: updateRes.data.skills });

        // 4. Test Assignment in Stage Update
        if (interviewersRes.data.length > 0) {
            const interviewerId = interviewersRes.data[0]._id;
            logger(`Testing Candidate: Assigning Round to ${interviewersRes.data[0].email}`);
            const assignRes = await axios.patch(`${BASE_URL}/candidates/${targetId}/stage`, {
                stage: 'L2',
                feedbackText: 'Technical round assignment test',
                assignedInterviewer: interviewerId,
                scheduledTime: new Date(Date.now() + 86400000).toISOString() // Tomorrow
            }, config);
            logger("Assignment Successful!", {
                stage: assignRes.data.currentStage,
                assignedTo: assignRes.data.assignedInterviewer,
                time: assignRes.data.scheduledTime
            });
        }

        console.log("\n\x1b[32m--- ALL REMAINING TESTS PASSED --- \x1b[0m");
        fs.unlinkSync(dummyPath);

    } catch (error) {
        console.error("\x1b[31m\n--- REMAINING TESTS FAILED ---\x1b[0m");
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
