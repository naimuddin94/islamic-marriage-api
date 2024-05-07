/* eslint-disable comma-dangle */
const MarriageInfo = require('../models/marriageInfo.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Controller to create marriage information
const createMarriageInfo = asyncHandler(async (req, res) => {
    const {
        guardiansPermission,
        veilAfterMarriage,
        partnerEducationPermission,
        partnerJobPermission,
        liveInformationAfterMarriage,
        expectedGift,
        thoughtAboutMarriage,
    } = trimObject(req.body);

    // Validating required fields
    const errors = emptyValidator(req.body, [
        'guardiansPermission',
        'veilAfterMarriage',
        'partnerEducationPermission',
        'partnerJobPermission',
        'liveInformationAfterMarriage',
        'expectedGift',
        'thoughtAboutMarriage',
    ]);

    // If there are validation errors, return a 400 Bad Request error
    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    // Create new marriage information
    const newMarriageInfo = await MarriageInfo.create({
        guardiansPermission,
        veilAfterMarriage,
        partnerEducationPermission,
        partnerJobPermission,
        liveInformationAfterMarriage,
        expectedGift,
        thoughtAboutMarriage,
        UserId: req.user?.id,
    });

    // If creation fails, return a 500 Internal Server Error
    if (!newMarriageInfo) {
        throw new ApiError(500, 'Failed to create marriage information');
    }

    // Return a 201 Created response with the created marriage information
    return res
        .status(201)
        .json(new ApiResponse(201, newMarriageInfo, 'Marriage information saved successfully'));
});

// Controller to update marriage information
const updateMarriageInfo = asyncHandler(async (req, res) => {
    const {
        guardiansPermission,
        veilAfterMarriage,
        partnerEducationPermission,
        partnerJobPermission,
        liveInformationAfterMarriage,
        expectedGift,
        thoughtAboutMarriage,
    } = trimObject(req.body);

    // Validating required fields
    const errors = emptyValidator(req.body, [
        'guardiansPermission',
        'veilAfterMarriage',
        'partnerEducationPermission',
        'partnerJobPermission',
        'liveInformationAfterMarriage',
        'expectedGift',
        'thoughtAboutMarriage',
    ]);

    // If there are validation errors, return a 400 Bad Request error
    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    // Find marriage information to update
    const marriageInfoToUpdate = await MarriageInfo.findOne({
        where: { UserId: req.user?.id },
    });

    // If marriage information is not found, return a 404 Not Found error
    if (!marriageInfoToUpdate) {
        throw new ApiError(404, 'Marriage information not found');
    }

    // Update marriage information
    await marriageInfoToUpdate.update({
        guardiansPermission,
        veilAfterMarriage,
        partnerEducationPermission,
        partnerJobPermission,
        liveInformationAfterMarriage,
        expectedGift,
        thoughtAboutMarriage,
    });

    // Return a 200 OK response with the updated marriage information
    return res.json(
        new ApiResponse(200, marriageInfoToUpdate, 'Marriage information updated successfully')
    );
});

// Get single marriage information by primary key
const getSingleMarriageInfo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Fetch the address by its primary key
    const partner = await MarriageInfo.findByPk(id, {
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'UserId'],
        },
    });

    if (!partner) {
        throw new ApiError(404, 'Marriage information not found');
    }

    // Send the response
    return res
        .status(200)
        .json(new ApiResponse(200, partner, 'Marriage information fetched successfully'));
});

module.exports = {
    createMarriageInfo,
    updateMarriageInfo,
    getSingleMarriageInfo,
};
