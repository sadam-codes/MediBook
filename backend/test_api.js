
const axios = require('axios');

async function testFetchDoctors() {
    try {
        // Note: I don't have a JWT token here, so I might get 401.
        // But let's see if the server responds.
        const res = await axios.get('http://localhost:5000/doctors');
        console.log('Doctors Data:', res.data);
    } catch (err) {
        if (err.response) {
            console.log('Error Status:', err.response.status);
            console.log('Error Data:', err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
}

testFetchDoctors();
