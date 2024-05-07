/* eslint-disable prettier/prettier */
const Contact = require('../models/contact.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new contact
const createContact = asyncHandler(async (req, res) => {
  const {
 groomName, guardianMobile, guardianRelationship, email,
} = trimObject(
    req.body,
  );

  const errors = emptyValidator(req.body, [
    'groomName',
    'guardianMobile',
    'guardianRelationship',
    'email',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const contact = await Contact.create({
    groomName,
    guardianMobile,
    guardianRelationship,
    email,
    UserId: req.user?.id,
  });

  if (!contact) {
    throw new ApiError(500, 'Something went wrong while creating the contact');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, contact, 'Contact saved successfully'));
});

// Update an existing contact
const updateContact = asyncHandler(async (req, res) => {
  const {
 groomName, guardianMobile, guardianRelationship, email,
} = trimObject(
    req.body,
  );

  const errors = emptyValidator(req.body, [
    'groomName',
    'guardianMobile',
    'guardianRelationship',
    'email',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const contact = await Contact.findOne({ where: { UserId: req.user?.id } });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  // Update contact
  await contact.update({
    groomName,
    guardianMobile,
    guardianRelationship,
    email,
  });

  return res.json(
    new ApiResponse(200, contact, 'Contact updated successfully'),
  );
});

// Get single address by primary key
const getSingleContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the contact by its primary key
  const contact = await Contact.findByPk(id, {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'UserId'],
    },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  // Send the response
  return res
    .status(200)
    .json(new ApiResponse(200, contact, 'Contact fetched successfully'));
});

module.exports = { createContact, updateContact, getSingleContact };
