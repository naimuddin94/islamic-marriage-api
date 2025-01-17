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
    throw new ApiError(400, errors.join(', '), errors);
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
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

  const message = `Your Islamic Marriage verify OTP is: ${otp}`;

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

  return res
    .status(201)
    .json(
      new ApiResponse(201, mobileNumber, 'OTP send on mobile successfully'),
    );
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
    throw new ApiError(400, errors.join(', '), errors);
  }

  const existsUser = await User.findOne({
    where: {
      [Op.or]: [{ email: email.toLowerCase() }, { mobileNumber }],
    },
  });

  if (existsUser) {
    throw new ApiError(400, 'Email or mobile already exists');
  }

  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    gender,
    role,
    isVerified: true,
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
  const { identity, password } = trimObject(req.body);

  const errors = emptyValidator(req.body, ['password', 'identity']);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const existsUser = await User.findOne({
    where: {
      [Op.or]: [{ email: identity.toLowerCase() }, { mobileNumber: identity }],
    },
  });

  if (!existsUser) {
    throw new ApiError(404, 'User not found');
  }

  if (!existsUser.isVerified) {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

    const message = `Your Islamic Marriage verify OTP is: ${otp}`;

    await sendSMS(message, existsUser.mobileNumber);

    existsUser.otp = otp;
    existsUser.otpExpiry = otpExpiry;
    existsUser.save({ validate: false });

    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          existsUser.mobileNumber,
          'Please verify your mobile number by sending the OTP that will be sent to your device.',
        ),
      );
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

  const message = `Your Islamic Marriage verify OTP is: ${otp}`;

  await sendSMS(message, mobileNumber);

  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

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

// change password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = trimObject(req.body);

  const errors = emptyValidator(req.body, ['oldPassword', 'newPassword']);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isValidPassword = user.isPasswordCorrect(oldPassword);

  if (!isValidPassword) {
    throw new ApiError(403, 'Invalid credentials');
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

// change fullname
const changeFullName = asyncHandler(async (req, res) => {
  const { fullName } = trimObject(req.body);

  console.log(fullName);

  const errors = emptyValidator(req.body, ['fullName']);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.fullName = fullName;
  await user.save();

  const response = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    gender: user.gender,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, 'User fullname changed successfully'));
});

// forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const { identity } = trimObject(req.body);

  const errors = emptyValidator(req.body, ['identity']);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: identity.toLowerCase() }, { mobileNumber: identity }],
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 1);

  const message = `Your Islamic Marriage verify OTP is: ${otp}`;

  await sendSMS(message, user?.mobileNumber);

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save({ validate: false });

  return res
    .status(200)
    .json(new ApiResponse(200, identity, 'OTP send successfully'));
});

// verify OTP for forget password
const verifyOTPForResetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword, mobileNumber } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'otp',
    'newPassword',
    'mobileNumber',
  ]);

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

  user.password = newPassword;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  const response = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    gender: user.gender,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, 'Password changed successfully'));
});

// visited biodata increase
const visitedBiodata = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.visitedBiodata += 1;

  await user.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.visitedBiodata, 'Successfully increase visited'),
    );
});

// sortListed biodata
const sortListed = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User id is required');
  }

  const sortedUser = await User.findByPk(userId);

  if (!sortedUser) {
    throw new ApiError(404, 'User id is no valid');
  }

  sortedUser.hasBeenSortListed += 1;

  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isExist = user.sortListed.find((element) => element === userId);

  if (isExist) {
    throw new ApiError(400, 'Already sort listed this biodata');
  }

  user.sortListed = [...user.sortListed, userId];

  await user.save({ validate: false });
  await sortedUser.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.sortListed, 'Successfully added to sort list'),
    );
});

// remove user id from sortListed biodata
const removeIdFromSortList = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User id is required');
  }

  const sortedUser = await User.findByPk(userId);

  if (!sortedUser) {
    throw new ApiError(404, 'User id is no valid');
  }

  sortedUser.hasBeenSortListed -= 1;

  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isExist = user.sortListed.find((element) => element === userId);

  if (!isExist) {
    throw new ApiError(404, 'This biodata not found your sort list');
  }

  user.sortListed = user.sortListed.filter((element) => element !== userId);

  await user.save({ validate: false });
  await sortedUser.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.sortListed, 'Remove successfully from the list'),
    );
});

// sortListed biodata
const ignoreList = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User id is required');
  }
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isExist = user.ignoreList.find((element) => element === userId);

  if (isExist) {
    throw new ApiError(400, 'Already ignore listed this biodata');
  }

  user.ignoreList = [...user.ignoreList, userId];

  await user.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.ignoreList, 'Successfully added to ignore list'),
    );
});

// remove user id from sortListed biodata
const removeIdFromIgnoreList = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, 'User id is required');
  }
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isExist = user.ignoreList.find((element) => element === userId);

  if (!isExist) {
    throw new ApiError(404, 'This biodata not found your ignore list');
  }

  user.ignoreList = user.ignoreList.filter((element) => element !== userId);

  await user.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.ignoreList, 'Remove successfully from the list'),
    );
});

// submit to biodata to admin
const submitBiodata = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user?.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isSubmitToVerify = true;

  await user.save({ validate: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, 'Send biodata to verification successfully'),
    );
});

module.exports = {
  registerUser,
  registerUserByAdmin,
  login,
  logout,
  userRefreshToken,
  sendOTP,
  verifyOTP,
  changePassword,
  changeFullName,
  forgetPassword,
  verifyOTPForResetPassword,
  visitedBiodata,
  sortListed,
  removeIdFromSortList,
  ignoreList,
  removeIdFromIgnoreList,
  submitBiodata,
};
