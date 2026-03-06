const axios = require('axios');

async function testDoctorsApi() {
    try {
        const res = await axios.get('http://localhost:5000/doctors');
        console.log('API Response Status:', res.status);
        console.log('Number of Doctors:', res.data.length);
        if (res.data.length > 0) {
            console.log('First Doctor Object:', JSON.stringify(res.data[0], null, 2));
        }
    } catch (err) {
        console.error('API Call Failed:', err.message);
    }
}

testDoctorsApi();
