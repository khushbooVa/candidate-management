const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api';

const testNLP = async () => {
    try {
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@talenthub.com',
            password: '123456'
        });
        const config = { headers: { Authorization: `Bearer ${loginRes.data.token}` } };

        const queries = [
            'Show L1 candidates',
            'Find developers with React',
            'Pending HR stage',
            'People in Director round',
            'test engineer'
        ];

        console.log("\x1b[32m--- NLP SEARCH STRESS TEST ---\x1b[0m");

        for (const q of queries) {
            const res = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(q)}`, config);
            console.log(`\nQuery: "\x1b[34m${q}\x1b[0m"`);
            console.log(`Results Found: ${res.data.length}`);
            console.log(`Names: ${res.data.map(c => c.name).join(', ') || 'None'}`);
        }

    } catch (error) {
        console.error("NLP Test Failed:", error.response ? error.response.data : error.message);
    }
};

testNLP();
