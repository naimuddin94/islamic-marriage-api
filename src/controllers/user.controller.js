/* eslint-disable prettier/prettier */
/* eslint-disable object-curly-newline */

// dependencies
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const otpGenerator = require('otp-generator');
const User = require('../models/user.model');
const { ApiError, ApiResponse, asyncHandler, sendSMS } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');
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
  const { fullName, email, mobileNumber, password, gender } = trimObject(
    req.body,
  );

  const errors = emptyValidator(req.body, [
    'fullName',
    'email',
    'mobileNumber',
    'password',
    'gender',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors[0], errors);
  }

  const existsUser = await User.findOne({
    where: {
      [Op.or]: [{ email: email.toLowerCase() }, { mobileNumber }],
    },
  });

  if (existsUser) {
    throw new ApiError(400, 'Email or mobile already exists');
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);

  const message = `Your Islamic Marriage verify OTP is:
                      ${otp}`;

  await sendSMS(message, mobileNumber);

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    gender,
    otp,
    otpExpiry,
  });

  if (!user) {
    throw new ApiError(
      500,
      'Something went wrong creating the user to database',
    );
  }

  // Fetch the newly created user excluding the password field
  // const createdUser = await User.findOne({
  //   where: { id: user.id },
  //   attributes: { exclude: ['password'] }, // Exclude the password field
  // });

  // if (!createdUser) {
  //   throw new ApiError(500, 'Something went wrong while registering the user');
  // }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, 'OTP send on mobile successfully'));
});

// create a new user by admin with role
const registerUserByAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, mobileNumber, password, gender, role } = trimObject(
    req.body,
  );

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

  const existsUser = await User.findOne({
    where: {
      [Op.or]: [{ email: email.toLowerCase() }, { mobileNumber }],
    },
  });

  if (existsUser) {
    throw new ApiError(400, 'Email or mobile already exists');
  }
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    gender,
    otp,
    otpExpiry,
    role,
  });

  if (!user) {
    throw new ApiError(
      500,
      'Something went wrong creating the user to database',
    );
  }

  // Fetch the newly created user excluding the password field
  const createdUser = await User.findOne({
    where: { id: user.id },
    attributes: { exclude: ['password'] }, // Exclude the password field
  });

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'Registration successfully'));
});

// user authentication functionality
const login = asyncHandler(async (req, res) => {
  const { email, password } = trimObject(req.body);

  const errors = emptyValidator(req.body, ['email', 'password']);

  if (errors.length > 0) {
    throw new ApiError(400, errors[0], errors);
  }

  const existsUser = await User.findOne({
    where: { email: email.toLowerCase() },
  });

  if (!existsUser) {
    throw new ApiError(404, 'User not found');
  }

  if (!existsUser.isVerified) {
    throw new ApiError(400, 'Mobile number not verified');
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

// user logout functionality
const logout = asyncHandler(async (req, res) => {
  // find the user by id which from verify token
  const user = await User.findByPk(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // update the user record to remove the refreshToken field
  await user.update({ refreshToken: null });

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'Logout successfully'));
});

// refresh user token
const userRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findByPk(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user.id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          'Access token refreshed',
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

// send otp request
const sendOTP = asyncHandler(async (req, res) => {
  const { mobileNumber } = trimObject(req.body);

  const errors = emptyValidator(req.body, ['mobileNumber']);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const user = await User.findOne({ where: { mobileNumber } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const message = `Your Islamic Marriage verify OTP is:
                      ${otp}`;

  await sendSMS(message, mobileNumber);

  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 3);

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save({ validate: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Send otp successfully'));
});

// verify account with OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { mobileNumber, otp } = trimObject(req.body);

   const errors = emptyValidator(req.body, ['mobileNumber', 'otp']);

   if (errors.length) {
     throw new ApiError(400, errors.join(', '), errors);
   }

  const user = await User.findOne({ where: { mobileNumber } });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isExpiredOTP = user?.otpExpiry < Date.now();

  if (isExpiredOTP) {
    throw new ApiError(400, 'OTP expired');
  }

  if (user?.otp !== otp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save({ validate: false });

  const response = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    isVerified: user.isVerified,
    gender: user.gender,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, response, 'Account registered successfully'));
});

module.exports = {
  registerUser,
  registerUserByAdmin,
  login,
  logout,
  userRefreshToken,
  sendOTP,
  verifyOTP,
};
