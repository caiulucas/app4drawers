const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const options = {
  storage: multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, path.resolve('uploads', 'images', 'avatars'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        cb(null, `${hash.toString('HEX')}${file.originalname}`);
      });
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/pgjep', 'image/png'];

    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
};

module.exports = multer(options);
