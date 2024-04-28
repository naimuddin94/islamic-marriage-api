/* eslint-disable camelcase */
require('dotenv').config();
const axios = require('axios');
const Settings = require('../models/setting.model');
const { ApiError } = require('./ApiError');

// Function to send SMS using elitbuzz API
async function sendSMS(message, phoneNumber) {
    try {
        const setting = await Settings.findByPk(1);
        if (!setting) {
            throw new ApiError(404, 'Not found admin sms setting');
        }
        const response = await axios.post(setting?.smsApi, {
            api_key: setting?.smsApiKey,
            senderid: setting?.smsSenderId,
            type: 'text',
            msg: message,
            contacts: phoneNumber,
        });

        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

module.exports = { sendSMS };
