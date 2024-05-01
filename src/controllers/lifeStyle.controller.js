/* eslint-disable prettier/prettier */
const LifeStyle = require('../models/lifeStyle.model');
const { ApiError, ApiResponse, asyncHandler } = require('../utils');
const { emptyValidator, trimObject } = require('../lib/validators');

// Create a new lifestyle information entry
const createLifeStyleInfo = asyncHandler(async (req, res) => {
  const {
    clothesInfo,
    breadInfo,
    clothesAnkles,
    prayInfo,
    qazaInfo,
    marhamInfo,
    reciteTheQuran,
    fiqh,
    moviesOrSongs,
    physicalDiseases,
    workOfDeen,
    mazarInfo,
    books,
    islamicScholars,
    applicable,
    hobbies,
    groomMobileNumber,
  } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'clothesInfo',
    'breadInfo',
    'clothesAnkles',
    'prayInfo',
    'qazaInfo',
    'marhamInfo',
    'reciteTheQuran',
    'fiqh',
    'moviesOrSongs',
    'physicalDiseases',
    'workOfDeen',
    'mazarInfo',
    'books',
    'islamicScholars',
    'hobbies',
    'groomMobileNumber',
  ]);

     if (errors.length) {
       throw new ApiError(400, errors.join(', '), errors);
     }

    let photoUrl = null;

    // Check if a file is uploaded
    if (req.file) {
      const hostname = `${req.protocol}://${req.get('host')}`; // Get the hostname

      // Normalize the file path to replace backslashes with forward slashes
      const normalizedFilePath = req.file.path.replace(/\\/g, '/');

      // Concatenate hostname with normalized file path to form full URL
      photoUrl = `${hostname}/${normalizedFilePath}`;
    }

  const lifeStyleInfo = await LifeStyle.create({
    clothesInfo,
    breadInfo,
    clothesAnkles,
    prayInfo,
    qazaInfo,
    marhamInfo,
    reciteTheQuran,
    fiqh,
    moviesOrSongs,
    physicalDiseases,
    workOfDeen,
    mazarInfo,
    books,
    islamicScholars,
    applicable,
    hobbies,
    groomMobileNumber,
    photo: photoUrl,
    UserId: req.user?.id,
  });

  if (!lifeStyleInfo) {
    throw new ApiError(
      500,
      'Something went wrong while creating the lifestyle information',
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        lifeStyleInfo,
        'Lifestyle information saved successfully',
      ),
    );
});

// Update an existing lifestyle information entry
const updateLifeStyleInfo = asyncHandler(async (req, res) => {
  const {
    clothesInfo,
    breadInfo,
    clothesAnkles,
    prayInfo,
    qazaInfo,
    marhamInfo,
    reciteTheQuran,
    fiqh,
    moviesOrSongs,
    physicalDiseases,
    workOfDeen,
    mazarInfo,
    books,
    islamicScholars,
    applicable,
    hobbies,
    groomMobileNumber,
  } = trimObject(req.body);

  const errors = emptyValidator(req.body, [
    'clothesInfo',
    'breadInfo',
    'clothesAnkles',
    'prayInfo',
    'qazaInfo',
    'marhamInfo',
    'reciteTheQuran',
    'fiqh',
    'moviesOrSongs',
    'physicalDiseases',
    'workOfDeen',
    'mazarInfo',
    'books',
    'islamicScholars',
    'hobbies',
    'groomMobileNumber',
  ]);

  if (errors.length) {
    throw new ApiError(400, errors.join(', '), errors);
    }

    let photoUrl = null;

    // Check if a file is uploaded
    if (req.file) {
      const hostname = `${req.protocol}://${req.get('host')}`; // Get the hostname

      // Normalize the file path to replace backslashes with forward slashes
      const normalizedFilePath = req.file.path.replace(/\\/g, '/');

      // Concatenate hostname with normalized file path to form full URL
      photoUrl = `${hostname}/${normalizedFilePath}`;
    }

  const lifeStyleInfo = await LifeStyle.findOne({
    where: { UserId: req.user?.id },
  });

  if (!lifeStyleInfo) {
    throw new ApiError(404, 'Lifestyle information not found');
  }

  // Update lifestyle information
  await lifeStyleInfo.update({
    clothesInfo,
    breadInfo,
    clothesAnkles,
    prayInfo,
    qazaInfo,
    marhamInfo,
    reciteTheQuran,
    fiqh,
    moviesOrSongs,
    physicalDiseases,
    workOfDeen,
    mazarInfo,
    books,
    islamicScholars,
    applicable,
    hobbies,
    groomMobileNumber,
    photo: photoUrl || lifeStyleInfo.photo,
  });

  return res.json(
    new ApiResponse(
      200,
      lifeStyleInfo,
      'Lifestyle information updated successfully',
    ),
  );
});

module.exports = { createLifeStyleInfo, updateLifeStyleInfo };
