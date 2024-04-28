/* eslint-disable prettier/prettier */
const { Router } = require('express');
const {
    login,
    logout,
    userRefreshToken,
    sendOTP,
} = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyToken, logout);
authRouter.route('/refresh-token').post(userRefreshToken);
authRouter.route('/send-otp').post(sendOTP);

module.exports = { authRouter };
