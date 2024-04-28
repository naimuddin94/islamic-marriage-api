/* eslint-disable prettier/prettier */
const { Router } = require('express');
const {
  login,
  logout,
  userRefreshToken,
  sendOTP,
  verifyOTP,
} = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyToken, logout);
authRouter.route('/refresh-token').post(userRefreshToken);
authRouter.route('/send-otp').post(sendOTP);
authRouter.route('/verify-otp').post(verifyOTP);

module.exports = { authRouter };
