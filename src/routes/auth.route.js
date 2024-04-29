/* eslint-disable prettier/prettier */
const { Router } = require('express');
const {
  login,
  logout,
  userRefreshToken,
  sendOTP,
  verifyOTP,
  changePassword,
  forgetPassword,
  verifyOTPForResetPassword,
} = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyToken, logout);
authRouter.route('/refresh-token').post(userRefreshToken);
authRouter.route('/send-otp').post(sendOTP);
authRouter.route('/verify-otp').post(verifyOTP);
authRouter.route('/change-password').post(verifyToken, changePassword);
authRouter.route('/forget-password').post(forgetPassword);
authRouter.route('/forget-password-verify-otp').post(verifyOTPForResetPassword);

module.exports = { authRouter };
