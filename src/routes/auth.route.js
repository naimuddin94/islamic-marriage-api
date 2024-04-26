const { Router } = require('express');
const { login, logout } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const authRouter = Router();

authRouter.route('/login').post(login);
authRouter.route('/logout').post(verifyToken, logout);

module.exports = { authRouter };
