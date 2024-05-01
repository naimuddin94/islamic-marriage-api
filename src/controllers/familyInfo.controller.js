/* eslint-disable prettier/prettier */
const FamilyInfo = require('../models/familyInfo.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new family information entry
const createFamilyInfo = asyncHandler(async (req, res) => {
  const {
    fatherName,
    isFatherAlive,
    fatherOccupation,
    motherName,
    isMotherAlive,
    motherOccupation,
    educationInstitute,
    brothersCount,
    brotherInformation,
    sistersCount,
    sisterInformation,
    occupationOfUnclesAndAunts,
    familyIncome,
    familyReligionEnvironment,
  } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'fatherName',
    'isFatherAlive',
    'fatherOccupation',
    'motherName',
    'isMotherAlive',
    'motherOccupation',
    'educationInstitute',
    'brothersCount',
    'brotherInformation',
    'sistersCount',
    'sisterInformation',
    'occupationOfUnclesAndAunts',
    'familyIncome',
    'familyReligionEnvironment',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const familyInfo = await FamilyInfo.create({
    fatherName,
    isFatherAlive,
    fatherOccupation,
    motherName,
    isMotherAlive,
    motherOccupation,
    educationInstitute,
    brothersCount,
    brotherInformation,
    sistersCount,
    sisterInformation,
    occupationOfUnclesAndAunts,
    familyIncome,
    familyReligionEnvironment,
    UserId: req.user?.id,
  });

  if (!familyInfo) {
    throw new ApiError(
      500,
      'Something went wrong while creating the family information',
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, familyInfo, 'Family information saved successfully'),
    );
});

// Update an existing family information entry
const updateFamilyInfo = asyncHandler(async (req, res) => {
  const {
    fatherName,
    isFatherAlive,
    fatherOccupation,
    motherName,
    isMotherAlive,
    motherOccupation,
    educationInstitute,
    brothersCount,
    brotherInformation,
    sistersCount,
    sisterInformation,
    occupationOfUnclesAndAunts,
    familyIncome,
    familyReligionEnvironment,
  } = trimObject(req.body);

  console.log(99, { builtin: req.href });

  const errors = emptyValidator(req.body, [
    'fatherName',
    'isFatherAlive',
    'fatherOccupation',
    'motherName',
    'isMotherAlive',
    'motherOccupation',
    'educationInstitute',
    'brothersCount',
    'brotherInformation',
    'sistersCount',
    'sisterInformation',
    'occupationOfUnclesAndAunts',
    'familyIncome',
    'familyReligionEnvironment',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const familyInfo = await FamilyInfo.findOne({
    where: { UserId: req.user?.id },
  });

  if (!familyInfo) {
    throw new ApiError(404, 'Family information not found');
  }

  // Update family information
  await familyInfo.update({
    fatherName,
    isFatherAlive,
    fatherOccupation,
    motherName,
    isMotherAlive,
    motherOccupation,
    educationInstitute,
    brothersCount,
    brotherInformation,
    sistersCount,
    sisterInformation,
    occupationOfUnclesAndAunts,
    familyIncome,
    familyReligionEnvironment,
  });

  return res.json(
    new ApiResponse(200, familyInfo, 'Family information updated successfully'),
  );
});

module.exports = { createFamilyInfo, updateFamilyInfo };
