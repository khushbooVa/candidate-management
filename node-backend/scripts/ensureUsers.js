const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const users = [
    { email: 'admin@talenthub.com', password: '123456', role: 'HR' },
    { email: 'interviewer@talenthub.com', password: '123456', role: 'Interviewer' }
];

const ensureUsers = async () => {
    console.log("\x1b[34m[SETUP] Ensuring test users exist...\x1b[0m");
    for (const user of users) {
        try {
            await axios.post(`${BASE_URL}/auth/register`, user);
            console.log(`\x1b[32m[SUCCESS] Registered ${user.role}: ${user.email}\x1b[0m`);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(`\x1b[33m[INFO] User ${user.email} already exists.\x1b[0m`);
            } else {
                console.error(`\x1b[31m[ERROR] Failed to register ${user.email}:\x1b[0m`,
                    error.response ? error.response.data.message : error.message);
            }
        }
    }
};

ensureUsers();
