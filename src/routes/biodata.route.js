const { Router } = require('express');
const {
    createPersonalInfo,
    updatePersonalInfo,
} = require('../controllers/personalInfo.controller');
const { createAddress, updateAddress } = require('../controllers/address.controller');
const { createEducation, updateEducation } = require('../controllers/education.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const biodataRouter = Router();

biodataRouter.route('/personal-info/create').post(verifyToken, createPersonalInfo);
biodataRouter.route('/personal-info/update').put(verifyToken, updatePersonalInfo);
biodataRouter.route('/address/create').post(verifyToken, createAddress);
biodataRouter.route('/address/update').put(verifyToken, updateAddress);
biodataRouter.route('/education/create').post(verifyToken, createEducation);
biodataRouter.route('/education/update').put(verifyToken, updateEducation);

module.exports = biodataRouter;
