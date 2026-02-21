const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const dummyData = [
    { name: 'Alice Johnson', email: 'alice@example.com', skills: 'React, Redux, Tailwind', stage: 'Screening' },
    { name: 'Bob Smith', email: 'bob@example.com', skills: 'Node.js, Express, MongoDB', stage: 'L1' },
    { name: 'Charlie Davis', email: 'charlie@example.com', skills: 'Python, Django, AWS', stage: 'L2' },
    { name: 'Diana Prince', email: 'diana@example.com', skills: 'Java, Spring Boot, SQL', stage: 'Director' },
    { name: 'Ethan Hunt', email: 'ethan@example.com', skills: 'Go, Kubernetes, Docker', stage: 'HR' },
];

const seed = async () => {
    try {
        console.log("[\x1b[34mSEED\x1b[0m] Logging in...");
        let loginRes;
        try {
            loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@talenthub.com',
                password: '123456'
            });
        } catch (err) {
            console.log("[\x1b[34mSEED\x1b[0m] Login failed, registering admin...");
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
        const token = loginRes.data.token;

        // Create dummy resume
        const resumePath = path.join(__dirname, 'temp_resume.pdf');
        fs.writeFileSync(resumePath, 'Dummy Resume Content');

        for (const candidate of dummyData) {
            console.log(`[\x1b[34mSEED\x1b[0m] Creating ${candidate.name}...`);
            const form = new FormData();
            form.append('name', candidate.name);
            form.append('email', candidate.email);
            form.append('skills', candidate.skills);
            form.append('resume', fs.createReadStream(resumePath));

            const res = await axios.post(`${BASE_URL}/candidates`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...form.getHeaders()
                }
            });

            // If stage is not screening, update it
            if (candidate.stage !== 'Screening') {
                await axios.patch(`${BASE_URL}/candidates/${res.data._id}/stage`, {
                    stage: candidate.stage,
                    feedbackText: 'Seeded initial stage'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        }

        fs.unlinkSync(resumePath);
        console.log("\x1b[32mSuccessfully seeded 5 dummy candidates!\x1b[0m");

    } catch (error) {
        console.error("Seed failed:", error.response ? error.response.data : error.message);
    }
};

seed();
