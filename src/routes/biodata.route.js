const { Router } = require('express');
const {
    createPersonalInfo,
    updatePersonalInfo,
    getSinglePersonalInfo,
} = require('../controllers/personalInfo.controller');
const {
    createAddress,
    updateAddress,
    getSingleAddress,
} = require('../controllers/address.controller');
const { createEducation, updateEducation } = require('../controllers/education.controller');
const {
    createFamilyInfo,
    updateFamilyInfo,
    getSingleFamilyInfo,
} = require('../controllers/familyInfo.controller');
const {
    createLifeStyleInfo,
    updateLifeStyleInfo,
    getSingleLifestyle,
} = require('../controllers/lifeStyle.controller');
const {
    createOccupation,
    updateOccupation,
    getSingleOccupation,
} = require('../controllers/occupation.controller');

const {
    createPartner,
    updatePartner,
    getSinglePartner,
} = require('../controllers/expectedPartner.controller');

const {
    createMarriageInfo,
    updateMarriageInfo,
    getSingleMarriageInfo,
} = require('../controllers/marriageInfo.controller');

const { createPledge, updatePledge, getSinglePledge } = require('../controllers/pledge.controller');

const {
    createContact,
    updateContact,
    getSingleContact,
} = require('../controllers/contact.controller');

const { getSingleBiodata, getAllBiodata } = require('../controllers/biodata.controller');

const { verifyToken } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer.middleware');

const biodataRouter = Router();

// Routes for handling personal information
biodataRouter.route('/personal-info/create').post(verifyToken, createPersonalInfo);
biodataRouter.route('/personal-info/update').put(verifyToken, updatePersonalInfo);

// Routes for handling address information
biodataRouter.route('/address/create').post(verifyToken, createAddress);
biodataRouter.route('/address/update').put(verifyToken, updateAddress);

// Routes for handling education information
biodataRouter.route('/education/create').post(verifyToken, createEducation);
biodataRouter.route('/education/update').put(verifyToken, updateEducation);

// Routes for handling family information
biodataRouter.route('/family-info/create').post(verifyToken, createFamilyInfo);
biodataRouter.route('/family-info/update').put(verifyToken, updateFamilyInfo);

// Routes for handling lifestyle information
biodataRouter
    .route('/lifestyle/create')
    .post(verifyToken, upload.single('photo'), createLifeStyleInfo);
biodataRouter
    .route('/lifestyle/update')
    .put(verifyToken, upload.single('photo'), updateLifeStyleInfo);

// Routes for handling occupation information
biodataRouter.route('/occupation/create').post(verifyToken, createOccupation);
biodataRouter.route('/occupation/update').put(verifyToken, updateOccupation);

// Routes for handling marriage information
biodataRouter.route('/marriage-info/create').post(verifyToken, createMarriageInfo);
biodataRouter.route('/marriage-info/update').put(verifyToken, updateMarriageInfo);

// Routes for handling partner information
biodataRouter.route('/expected-partner/create').post(verifyToken, createPartner);
biodataRouter.route('/expected-partner/update').put(verifyToken, updatePartner);

// Routes for handling pledge
biodataRouter.route('/pledge/create').post(verifyToken, createPledge);
biodataRouter.route('/pledge/update').put(verifyToken, updatePledge);

// Routes for handling contact information
biodataRouter.route('/contact/create').post(verifyToken, createContact);
biodataRouter.route('/contact/update').put(verifyToken, updateContact);

// all biodata related routes
biodataRouter.route('/all').get(getAllBiodata);
biodataRouter.route('/single/:userId').get(getSingleBiodata);

// Fetched single data routes
biodataRouter.route('/address/fetch/:id').get(getSingleAddress);
biodataRouter.route('/contact/fetch/:id').get(getSingleContact);
biodataRouter.route('/partner/fetch/:id').get(getSinglePartner);
biodataRouter.route('/family-info/fetch/:id').get(getSingleFamilyInfo);
biodataRouter.route('/lifestyle/fetch/:id').get(getSingleLifestyle);
biodataRouter.route('/marriage-info/fetch/:id').get(getSingleMarriageInfo);
biodataRouter.route('/occupation/fetch/:id').get(getSingleOccupation);
biodataRouter.route('/personal-info/fetch/:id').get(getSinglePersonalInfo);
biodataRouter.route('/pledge/fetch/:id').get(getSinglePledge);

module.exports = biodataRouter;
