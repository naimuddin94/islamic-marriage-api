const { Router } = require('express');
const { registerUserByAdmin } = require('../controllers/user.controller');
const { updateSettings } = require('../controllers/setting.controller');
// const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { submittedBiodata, changeApprovedStatus } = require('../controllers/admin.controller');

const adminRouter = Router();

// TODO: here must be added two middlewares

adminRouter.route('/register-user').post(registerUserByAdmin);
adminRouter.route('/settings').put(updateSettings);
adminRouter.route('/submitted-biodata').get(submittedBiodata);
adminRouter.route('/change-status').post(changeApprovedStatus);

module.exports = { adminRouter };
