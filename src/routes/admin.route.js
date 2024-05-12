const { Router } = require('express');
const { registerUserByAdmin } = require('../controllers/user.controller');
const { updateSettings } = require('../controllers/setting.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

const adminRouter = Router();

// TODO: here must be added two middlewares

adminRouter.route('/register-user').post(registerUserByAdmin);
adminRouter.route('/settings').put(updateSettings);

module.exports = { adminRouter };
