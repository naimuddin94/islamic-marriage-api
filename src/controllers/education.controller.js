const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');
const Education = require('../models/education.model');

// Create a new education record
const createEducation = asyncHandler(async (req, res) => {
    const {
        medium,
        qualification,
        submission,
        category,
        result,
        isDiplomaSubject,
        institution,
        passingYear,
        otherQualifications,
        religiousEducation,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'medium',
        'qualification',
        'submission',
        'category',
        'result',
        'isDiplomaSubject',
        'institution',
        'passingYear',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const education = await Education.create({
        medium,
        qualification,
        submission,
        category,
        result,
        isDiplomaSubject,
        institution,
        passingYear,
        otherQualifications,
        religiousEducation,
        UserId: req.user?.id,
    });

    if (!education) {
        throw new ApiError(500, 'Something went wrong while creating the education record');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, education, 'Education record saved successfully'));
});

// Update an existing education record
const updateEducation = asyncHandler(async (req, res) => {
    const {
        medium,
        qualification,
        submission,
        category,
        result,
        isDiplomaSubject,
        institution,
        passingYear,
        otherQualifications,
        religiousEducation,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'medium',
        'qualification',
        'submission',
        'category',
        'result',
        'isDiplomaSubject',
        'institution',
        'passingYear',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const education = await Education.findOne({
        where: { UserId: req.user?.id },
    });

    if (!education) {
        throw new ApiError(404, 'Education record not found');
    }

    // Update education record
    await education.update({
        medium,
        qualification,
        submission,
        category,
        result,
        isDiplomaSubject,
        institution,
        passingYear,
        otherQualifications,
        religiousEducation,
    });

    return res.json(new ApiResponse(200, education, 'Education record updated successfully'));
});

// Get single education by primary key
const getSingleEducation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Fetch the contact by its primary key
    const contact = await Education.findByPk(id, {
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'UserId'],
        },
    });

    if (!contact) {
        throw new ApiError(404, 'Education not found');
    }

    // Send the response
    return res.status(200).json(new ApiResponse(200, contact, 'Education fetched successfully'));
});

module.exports = { createEducation, updateEducation, getSingleEducation };
