/* eslint-disable prettier/prettier */
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    console.log(10, file);
    const fileExt = path.extname(file.originalname);
    const fileName = `${file.originalname
      .replace(fileExt, '')
      .toLocaleLowerCase()
      .split(' ')
      .join('-')}-${Date.now()}`;

    cb(null, fileName + fileExt);
  },
});

const upload = multer({ storage });

module.exports = { upload };
