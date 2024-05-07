/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
const User = require('../models/user.model');
const PersonalInfo = require('../models/personalInfo.model');
const Address = require('../models/address.model');
const Education = require('../models/education.model');
const FamilyInfo = require('../models/familyInfo.model');
const LifeStyle = require('../models/lifeStyle.model');
const MarriageInfo = require('../models/marriageInfo.model');
const Occupation = require('../models/occupation.model');
const ExpectedPartner = require('../models/expectedPartner.model');
const Pledge = require('../models/pledge.model');
const Contact = require('../models/contact.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');

// Get all biodata
const getAllBiodata = asyncHandler(async (req, res) => {
    // Fetch all users along with their associated biodata information
    const usersWithBiodata = await User.findAll({
        include: [
            {
                model: Address,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: PersonalInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Education,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: FamilyInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: LifeStyle,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: MarriageInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Occupation,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: ExpectedPartner,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Pledge,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Contact,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
        ],
        attributes: {
            exclude: [
                'password',
                'refreshToken',
                'otp',
                'otpExpiry',
                'isVerified',
                'createdAt',
                'updatedAt',
            ],
        },
    });

    if (!usersWithBiodata) {
        throw new ApiError(404, 'No biodata found');
    }

    // Filter out users who are not approved
    const approvedBiodata = usersWithBiodata.filter((user) => user.isApproved);

    return res
        .status(200)
        .json(new ApiResponse(200, approvedBiodata, 'Biodata fetched successfully'));
});

// Get single biodata
const getSingleBiodata = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // Fetch user along with his associated biodata information
    const userWithBiodata = await User.findByPk(userId, {
        include: [
            {
                model: Address,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: PersonalInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Education,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: FamilyInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: LifeStyle,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: MarriageInfo,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Occupation,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: ExpectedPartner,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Pledge,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
            {
                model: Contact,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'UserId'],
                },
            },
        ],
        attributes: {
            exclude: [
                'password',
                'refreshToken',
                'otp',
                'otpExpiry',
                'isVerified',
                'createdAt',
                'updatedAt',
            ],
        },
    });

    if (!userWithBiodata) {
        throw new ApiError(404, 'No biodata found');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, userWithBiodata, 'Biodata fetched successfully'));
});

module.exports = { getAllBiodata, getSingleBiodata };
