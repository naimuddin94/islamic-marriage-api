/* eslint-disable prettier/prettier */
const PersonalInfo = require('../models/personalInfo.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new PersonalInformation
const createPersonalInfo = asyncHandler(async (req, res) => {
    const {
        typeOfBiodata,
        maritalStatus,
        dateOfBirth,
        height,
        complexion,
        weight,
        bloodGroup,
        nationality,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'typeOfBiodata',
        'maritalStatus',
        'dateOfBirth',
        'height',
        'complexion',
        'weight',
        'bloodGroup',
        'nationality',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const personalInfo = await PersonalInfo.create({
        typeOfBiodata,
        maritalStatus,
        dateOfBirth,
        height,
        complexion,
        weight,
        bloodGroup,
        nationality,
        UserId: req.user?.id,
    });

    if (!personalInfo) {
        throw new ApiError(500, 'Something went wrong while creating personal information');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, personalInfo, 'Personal Information saved successfully'));
});

// Update PersonalInformation
const updatePersonalInfo = asyncHandler(async (req, res) => {
    const {
        typeOfBiodata,
        maritalStatus,
        dateOfBirth,
        height,
        complexion,
        weight,
        bloodGroup,
        nationality,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'typeOfBiodata',
        'maritalStatus',
        'dateOfBirth',
        'height',
        'complexion',
        'weight',
        'bloodGroup',
        'nationality',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const personalInfo = await PersonalInfo.findOne({ where: { UserId: req.user?.id } });

    if (!personalInfo) {
        throw new ApiError(404, 'Personal Information not found');
    }

    // Update personal information
    await personalInfo.update({
        typeOfBiodata,
        maritalStatus,
        dateOfBirth,
        height,
        complexion,
        weight,
        bloodGroup,
        nationality,
    });

    return res.json(
        new ApiResponse(200, personalInfo, 'Personal Information updated successfully'),
    );
});

module.exports = { createPersonalInfo, updatePersonalInfo };
