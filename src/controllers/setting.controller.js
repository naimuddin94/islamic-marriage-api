const Settings = require('../models/setting.model');
const { asyncHandler, ApiError, ApiResponse } = require('../utils');
const { emptyValidator } = require('../lib/validators');

// update settings
const updateSettings = asyncHandler(async (req, res) => {
    const {
        stripePublisherKey,
        stripeSecretKey,
        payPalClientKey,
        zellePayNumber,
        smsApi,
        adminEmailAddress,
        successfulMarriage,
        youtubeEmbedVideoLink,
        logo,
    } = req.body;

    const errors = emptyValidator(req.body, [
        'smsApi',
        'adminEmailAddress',
        'successfulMarriage',
        'youtubeEmbedVideoLink',
        'logo',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors[0], errors);
    }

    // Fetch existing settings
    let setting = await Settings.findOne();

    // If settings don't exist, create new
    if (!setting) {
        setting = new Settings({
            stripePublisherKey,
            stripeSecretKey,
            payPalClientKey,
            zellePayNumber,
            smsApi,
            adminEmailAddress,
            successfulMarriage,
            youtubeEmbedVideoLink,
            logo,
        });
    } else {
        // Update existing settings
        setting.stripePublisherKey = stripePublisherKey;
        setting.stripeSecretKey = stripeSecretKey;
        setting.payPalClientKey = payPalClientKey;
        setting.zellePayNumber = zellePayNumber;
        setting.smsApi = smsApi;
        setting.adminEmailAddress = adminEmailAddress;
        setting.successfulMarriage = successfulMarriage;
        setting.youtubeEmbedVideoLink = youtubeEmbedVideoLink;
        setting.logo = logo;
    }

    // Save or update settings
    await setting.save();

    return res.status(201).json(new ApiResponse(200, setting, 'Settings updated'));
});

module.exports = { updateSettings };
