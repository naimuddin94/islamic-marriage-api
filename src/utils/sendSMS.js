/* eslint-disable camelcase */
require('dotenv').config();
const axios = require('axios');

// Function to send SMS using elitbuzz API
async function sendSMS(message, phoneNumber) {
    try {
        const api_key = process.env.ELITBUZZ_API_KEY;
        const senderid = process.env.ELITBUZZ_SENDER_ID;
        const url = 'https://msg.elitbuzz-bd.com/smsapi';

        const response = await axios.post(url, {
            api_key,
            senderid,
            type: 'text',
            msg: message,
            contacts: phoneNumber,
        });

        console.log('from sendSMS 17: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

module.exports = { sendSMS };
