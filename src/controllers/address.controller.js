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
  const addressId = req.params.id;
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

  const address = await Address.findByPk(addressId);

  if (!address) {
    throw new ApiError(404, 'Address not found');
  }

  // Check if the user is authorized to update this address
  if (address.UserId !== req.user.id) {
    throw new ApiError(403, 'Unauthorized to update this address');
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

module.exports = { createAddress, updateAddress };
