const { Router } = require('express');
const { login } = require('../controllers/user.controller');

const authRouter = Router();

authRouter.route('/login').post(login);

module.exports = { authRouter };
