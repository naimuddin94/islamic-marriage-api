const { Router } = require('express');
const { createPersonalInfo } = require('../controllers/personalInfo.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.route('/personal-info').post(verifyToken, createPersonalInfo);

module.exports = router;
