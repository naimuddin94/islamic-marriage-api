const { Router } = require('express');
const {
    createPersonalInfo,
    updatePersonalInfo,
} = require('../controllers/personalInfo.controller');
const { createAddress, updateAddress } = require('../controllers/address.controller');
const { createEducation, updateEducation } = require('../controllers/education.controller');
const { createFamilyInfo, updateFamilyInfo } = require('../controllers/familyInfo.controller');
const { createLifeStyleInfo, updateLifeStyleInfo } = require('../controllers/lifeStyle.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer.middleware');

const biodataRouter = Router();

biodataRouter.route('/personal-info/create').post(verifyToken, createPersonalInfo);
biodataRouter.route('/personal-info/update').put(verifyToken, updatePersonalInfo);
biodataRouter.route('/address/create').post(verifyToken, createAddress);
biodataRouter.route('/address/update').put(verifyToken, updateAddress);
biodataRouter.route('/education/create').post(verifyToken, createEducation);
biodataRouter.route('/education/update').put(verifyToken, updateEducation);
biodataRouter.route('/family-info/create').post(verifyToken, createFamilyInfo);
biodataRouter.route('/family-info/update').put(verifyToken, updateFamilyInfo);
biodataRouter
    .route('/lifestyle/create')
    .post(verifyToken, upload.single('photo'), createLifeStyleInfo);
biodataRouter
    .route('/lifestyle/update')
    .put(verifyToken, upload.single('photo'), updateLifeStyleInfo);

module.exports = biodataRouter;
