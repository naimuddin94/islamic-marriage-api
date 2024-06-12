/* eslint-disable radix */
/* eslint-disable object-curly-newline */

// dependencies
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

// for submitted biodata
const submittedBiodata = asyncHandler(async (req, res) => {
    const { offset, limit } = req.query;

    // Fetch all users along with their associated biodata information
    const { count, rows } = await User.findAndCountAll({
        where: {
            isSubmitToVerify: true,
        },
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
        offset: parseInt(offset),
        limit: parseInt(limit),
    });

    if (!rows) {
        throw new ApiError(404, 'No biodata found');
    }

    // Filter out users who are not approved
    const biodata = rows.filter((user) => user.isApproved);

    return res
        .status(200)
        .json(new ApiResponse(200, { count, biodata }, 'Biodata fetched successfully'));
});

// approved from administrator
const changeApprovedStatus = asyncHandler(async (req, res) => {
    const { userId, status } = req.body;

    if (!userId) {
        throw new ApiError(400, 'User id required');
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.isApproved = status;
    await user.save({ validate: false });

    return res.status(200).json(new ApiResponse(200, user, 'Successfully updated status'));
});

module.exports = { submittedBiodata, changeApprovedStatus };
