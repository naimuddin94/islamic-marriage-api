const { Router } = require('express');
const { registerUser, changeFullName } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/change-fullname').post(verifyToken, changeFullName);

module.exports = { userRouter };
