const { Router } = require('express');
const { login, logout, refreshToken } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyToken, logout);
authRouter.route('/refresh-token').post(refreshToken);

module.exports = { authRouter };
