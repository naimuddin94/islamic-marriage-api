const ExpectedPartner = require('../models/expectedPartner.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

const createPartner = asyncHandler(async (req, res) => {
    const {
        ageRange,
        complexion,
        height,
        educationalQualification,
        district,
        MaritalStatus,
        profession,
        financialCondition,
        expectedQuality,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'height',
        'educationalQualification',
        'district',
        'profession',
        'financialCondition',
        'expectedQuality',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const partner = await ExpectedPartner.create({
        ageRange,
        complexion,
        height,
        educationalQualification,
        district,
        MaritalStatus,
        profession,
        financialCondition,
        expectedQuality,
        UserId: req.user?.id,
    });

    if (!partner) {
        throw new ApiError(500, 'Something went wrong while creating the partner');
    }

    return res.status(201).json(new ApiResponse(201, partner, 'Partner saved successfully'));
});

const updatePartner = asyncHandler(async (req, res) => {
    const {
        ageRange,
        complexion,
        height,
        educationalQualification,
        district,
        MaritalStatus,
        profession,
        financialCondition,
        expectedQuality,
    } = trimObject(req.body);

    const errors = emptyValidator(req.body, [
        'height',
        'educationalQualification',
        'district',
        'profession',
        'financialCondition',
        'expectedQuality',
    ]);

    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    const partner = await ExpectedPartner.findOne({ where: { UserId: req.user?.id } });

    if (!partner) {
        throw new ApiError(404, 'Partner not found');
    }

    // Update partner
    await partner.update({
        ageRange,
        complexion,
        height,
        educationalQualification,
        district,
        MaritalStatus,
        profession,
        financialCondition,
        expectedQuality,
    });

    return res.json(new ApiResponse(200, partner, 'Partner updated successfully'));
});

// Get single expected partner by primary key
const getSinglePartner = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Fetch the address by its primary key
    const partner = await ExpectedPartner.findByPk(id, {
        attributes: {
            exclude: ['password', 'createdAt', 'updatedAt', 'UserId'],
        },
    });

    if (!partner) {
        throw new ApiError(404, 'Partner not found');
    }

    // Send the response
    return res.status(200).json(new ApiResponse(200, partner, 'Partner fetched successfully'));
});

module.exports = { createPartner, updatePartner, getSinglePartner };
