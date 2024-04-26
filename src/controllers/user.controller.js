/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator } = require('../lib/validators');
const { options } = require('../lib');

// utility functions
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validate: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong generating tokens');
    }
};

// create a new user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, mobileNumber, password, gender } = req.body;

    const errors = emptyValidator(req.body, [
        'fullName',
        'email',
        'mobileNumber',
        'password',
        'gender',
    ]);

    if (errors.length > 0) {
        throw new ApiError(400, errors[0], errors);
    }

    const existsUser = await User.findOne({ where: { email: email.toLowerCase() } });

    console.log(43, existsUser);

    if (existsUser) {
        throw new ApiError(400, 'Email already exists');
    }

    const user = await User.create({
        fullName,
        email,
        mobileNumber,
        password,
        gender,
    });

    if (!user) {
        throw new ApiError(500, 'Something went wrong creating the user to database');
    }

    // Fetch the newly created user excluding the password field
    const createdUser = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ['password'] }, // Exclude the password field
    });

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(new ApiResponse(201, createdUser, 'Registration successfully'));
});

// create a new user by admin with role
const registerUserByAdmin = asyncHandler(async (req, res) => {
    const { fullName, email, mobileNumber, password, gender, role } = req.body;

    const errors = emptyValidator(req.body, [
        'fullName',
        'email',
        'mobileNumber',
        'password',
        'gender',
        'role',
    ]);

    if (errors.length > 0) {
        throw new ApiError(400, errors[0], errors);
    }

    const existsUser = await User.findOne({ email });

    if (existsUser) {
        throw new ApiError(400, 'Email already exists');
    }

    const user = await User.create({
        fullName,
        email,
        mobileNumber,
        password,
        gender,
        role,
    });

    if (!user) {
        throw new ApiError(500, 'Something went wrong creating the user to database');
    }

    // Fetch the newly created user excluding the password field
    const createdUser = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ['password'] }, // Exclude the password field
    });

    if (!createdUser) {
        throw new ApiError(500, 'Something went wrong while registering the user');
    }

    return res.status(201).json(new ApiResponse(201, createdUser, 'Registration successfully'));
});

// user authentication method
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const errors = emptyValidator(req.body, ['email', 'password']);

    if (errors.length > 0) {
        throw new ApiError(400, errors[0], errors);
    }

    const existsUser = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!existsUser) {
        throw new ApiError(404, 'User not found');
    }

    const isValidPassword = existsUser.isPasswordCorrect(password);

    if (!isValidPassword) {
        throw new ApiError(403, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(existsUser.id);

    const user = existsUser.toJSON();

    delete user.password;

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                201,
                { user, accessToken, refreshToken },
                'Login successfully',
            ),
        );
});

module.exports = { registerUser, registerUserByAdmin, userLogin };
