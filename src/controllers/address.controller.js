/* eslint-disable prettier/prettier */
const Address = require('../models/address.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new address
const createAddress = asyncHandler(async (req, res) => {
  const {
      permanentAddress,
      isSameCurrentAddress,
      currentAddress,
      growUp,
    } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'permanentAddress',
    'growUp',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const address = await Address.create({
    permanentAddress,
    isSameCurrentAddress,
    currentAddress,
    growUp,
    UserId: req.user?.id,
  });

  if (!address) {
    throw new ApiError(500, 'Something went wrong while creating the address');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, address, 'Address saved successfully'));
});

// Update an existing address
const updateAddress = asyncHandler(async (req, res) => {
  const {
      permanentAddress,
      isSameCurrentAddress,
      currentAddress,
      growUp,
    } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'permanentAddress',
    'growUp',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const address = await Address.findOne({ where: { UserId: req.user?.id } });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  // Update address
  await address.update({
    permanentAddress,
    isSameCurrentAddress,
    currentAddress: isSameCurrentAddress ? permanentAddress : currentAddress,
    growUp,
  });

  return res.json(
    new ApiResponse(200, address, 'Address updated successfully'),
  );
});

// Get single address by primary key
const getSingleAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the address by its primary key
  const address = await Address.findByPk(id, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'UserId'],
    },
  });

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  // Send the response
  return res
    .status(200)
    .json(new ApiResponse(200, address, 'Address fetched successfully'));
});

module.exports = { createAddress, updateAddress, getSingleAddress };
