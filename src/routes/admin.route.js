const { Router } = require('express');
const { registerUserByAdmin } = require('../controllers/user.controller');
const { updateSettings } = require('../controllers/setting.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

const adminRouter = Router();

adminRouter.route('/register-user').post(verifyToken, verifyAdmin, registerUserByAdmin);
adminRouter.route('/settings').put(verifyToken, verifyAdmin, updateSettings);

module.exports = { adminRouter };
