const { Router } = require('express');
const {
    registerUser,
    changeFullName,
    visitedBiodata,
    sortListed,
    removeIdFromSortList,
    ignoreList,
    removeIdFromIgnoreList,
} = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { searchBiodata } = require('../controllers/biodata.controller');

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/change-fullname').post(verifyToken, changeFullName);
userRouter.route('/visited').put(verifyToken, visitedBiodata);
userRouter.route('/sortlisted').post(verifyToken, sortListed);
userRouter.route('/remove-from-sortlist').delete(verifyToken, removeIdFromSortList);
userRouter.route('/ignorelist').post(verifyToken, ignoreList);
userRouter.route('/remove-from-ignorelist').delete(verifyToken, removeIdFromIgnoreList);
userRouter.route('/searched-biodata').get(searchBiodata);

module.exports = { userRouter };
