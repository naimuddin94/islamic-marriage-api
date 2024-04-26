const { Router } = require('express');
const { userLogin } = require('../controllers/user.controller');

const authRouter = Router();

authRouter.route('/login').post(userLogin);

module.exports = { authRouter };
