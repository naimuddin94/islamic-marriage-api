const { Router } = require('express');
const {
    createPersonalInfo,
    updatePersonalInfo,
} = require('../controllers/personalInfo.controller');
const { createAddress, updateAddress } = require('../controllers/address.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const biodataRouter = Router();

biodataRouter.route('/personal-info').post(verifyToken, createPersonalInfo);
biodataRouter.route('/personal-info/:id').put(verifyToken, updatePersonalInfo);
biodataRouter.route('/address').post(verifyToken, createAddress);
biodataRouter.route('/address/:id').put(verifyToken, updateAddress);

module.exports = biodataRouter;
