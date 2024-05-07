/* eslint-disable prettier/prettier */
const Pledge = require('../models/pledge.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new pledge
const createPledge = asyncHandler(async (req, res) => {
  const { parentKnowSubmission, isAllInfoTrue, falseInfoProven } = trimObject(
    req.body,
  );

  const errors = emptyValidator(req.body, [
    'parentKnowSubmission',
    'isAllInfoTrue',
    'falseInfoProven',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const pledge = await Pledge.create({
    parentKnowSubmission,
    isAllInfoTrue,
    falseInfoProven,
    UserId: req.user?.id,
  });

  if (!pledge) {
    throw new ApiError(500, 'Something went wrong while creating the pledge');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, pledge, 'Pledge saved successfully'));
});

// Update an existing pledge
const updatePledge = asyncHandler(async (req, res) => {
  const { parentKnowSubmission, isAllInfoTrue, falseInfoProven } = trimObject(
    req.body,
  );

  const errors = emptyValidator(req.body, [
    'parentKnowSubmission',
    'isAllInfoTrue',
    'falseInfoProven',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const pledge = await Pledge.findOne({ where: { UserId: req.user?.id } });

  if (!pledge) {
    throw new ApiError(404, 'Pledge not found');
  }

  // Update pledge
  await pledge.update({
    parentKnowSubmission,
    isAllInfoTrue,
    falseInfoProven,
  });

  return res.json(new ApiResponse(200, pledge, 'Pledge updated successfully'));
});

module.exports = { createPledge, updatePledge };