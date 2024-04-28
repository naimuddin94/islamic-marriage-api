/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ApiError, asyncHandler } = require('../utils');

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken
      || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decodedToken.id, {
      attributes: {
        exclude: [
          'password',
          'createdAt',
          'updatedAt',
          'mobileNumber',
          'gender',
        ],
      },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const isAdmin = req.user.role === 'admin';
  if (!isAdmin) {
    throw new ApiError(401, 'Forbidden access');
  }
  next();
});

module.exports = { verifyToken, verifyAdmin };
