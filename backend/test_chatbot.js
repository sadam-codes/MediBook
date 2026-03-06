const axios = require('axios');

async function testChatbot() {
    try {
        console.log('Testing Chatbot Endpoint...');
        const response = await axios.post('http://localhost:5000/chatbot/chat', {
            message: 'I have heart pain and dizziness. Who should I see?'
        });
        console.log('Bot Response:');
        console.log(response.data.response);

        if (response.data.response.toLowerCase().includes('cardiologist')) {
            console.log('SUCCESS: Recommended Cardiologist for heart pain.');
        } else {
            console.log('WARNING: Heart pain mentioned but Cardiologist not explicitly found in response.');
        }

        const feverResponse = await axios.post('http://localhost:5000/chatbot/chat', {
            message: 'I have a high fever.'
        });
        console.log('\nBot Response for fever:');
        console.log(feverResponse.data.response);

        if (feverResponse.data.response.toLowerCase().includes('general physician')) {
            console.log('SUCCESS: Recommended General Physician for fever.');
        }

    } catch (error) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testChatbot();
