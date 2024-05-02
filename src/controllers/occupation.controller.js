const Occupation = require('../models/occupation.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Controller to create a new occupation
const createOccupation = asyncHandler(async (req, res) => {
    const { occupation, description, monthlyIncome } = trimObject(req.body);

    // Validating required fields
    const errors = emptyValidator(req.body, ['occupation', 'description', 'monthlyIncome']);

    // If there are validation errors, return a 400 Bad Request error
    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    // Create a new occupation
    const newOccupation = await Occupation.create({
        occupation,
        description,
        monthlyIncome,
        UserId: req.user?.id,
    });

    // If creation fails, return a 500 Internal Server Error
    if (!newOccupation) {
        throw new ApiError(500, 'Failed to create occupation');
    }

    // Return a 201 Created response with the created occupation
    return res
        .status(201)
        .json(new ApiResponse(201, newOccupation, 'Occupation saved successfully'));
});

// Controller to update an existing occupation
const updateOccupation = asyncHandler(async (req, res) => {
    const { occupation, description, monthlyIncome } = trimObject(req.body);

    // Validating required fields
    const errors = emptyValidator(req.body, ['occupation', 'description', 'monthlyIncome']);

    // If there are validation errors, return a 400 Bad Request error
    if (errors.length) {
        throw new ApiError(400, errors.join(', '), errors);
    }

    // Find the occupation to update
    const occupationToUpdate = await Occupation.findOne({
        where: { UserId: req.user?.id },
    });

    // If occupation is not found, return a 404 Not Found error
    if (!occupationToUpdate) {
        throw new ApiError(404, 'Occupation not found');
    }

    // Update the occupation
    await occupationToUpdate.update({
        occupation,
        description,
        monthlyIncome,
    });

    // Return a 200 OK response with the updated occupation
    return res.json(new ApiResponse(200, occupationToUpdate, 'Occupation updated successfully'));
});

module.exports = {
    createOccupation,
    updateOccupation,
};
