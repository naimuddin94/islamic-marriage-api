/* eslint-disable radix */
/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-linebreak */
const { Op } = require('sequelize');
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
  const { offset, limit } = req.query;

  // Fetch all users along with their associated biodata information
  const { count, rows } = await User.findAndCountAll({
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
    .json(
      new ApiResponse(200, { count, biodata }, 'Biodata fetched successfully'),
    );
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
    .json(
      new ApiResponse(200, userWithBiodata, 'Biodata fetched successfully'),
    );
});

// Search biodata by criteria
const searchBiodata = asyncHandler(async (req, res) => {
  const {
    offset,
    limit,
    permanentAddress,
    biodataType,
    maritalStatus,
    minAge,
    maxAge,
  } = req.query;

  // Build query criteria based on provided parameters
  const queryCriteria = {};

  if (permanentAddress) {
    queryCriteria['$Address.permanentAddress$'] = permanentAddress;
  }

  if (biodataType) {
    queryCriteria['$PersonalInformation.typeOfBiodata$'] = biodataType;
  }

  if (maritalStatus) {
    queryCriteria['$PersonalInformation.maritalStatus$'] = maritalStatus;
  }

  if (minAge && maxAge) {
    const currentDate = new Date();
    const minDateOfBirth = new Date(
      currentDate.getFullYear() - maxAge,
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const maxDateOfBirth = new Date(
      currentDate.getFullYear() - minAge,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    queryCriteria['$PersonalInformation.dateOfBirth$'] = {
      [Op.between]: [minDateOfBirth, maxDateOfBirth],
    };
  }
  // Fetch biodata matching the criteria
  const { count, rows } = await User.findAndCountAll({
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
        'sortListed',
        'ignoreList',
        'purchased',
        'connection',
        'sortListed',
      ],
    },
    where: queryCriteria,
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
    .json(
      new ApiResponse(200, { count, biodata }, 'Biodata fetched successfully'),
    );
});

module.exports = { getAllBiodata, getSingleBiodata, searchBiodata };
