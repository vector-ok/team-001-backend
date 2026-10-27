const path = require('path');
const HttpError = require('../utils/httpError');
const logger = require('../utils/logger');

const IMAGES_DIR = path.join(__dirname, '..', 'images');

const uploadImage = (req, res, next) => {
  const file = req.files && req.files.image;

  if (!file) {
    return next(new HttpError(400, 'No image uploaded. Send a file under the "image" field.'));
  }

  const filename = path.basename(file.name);

  return file.mv(path.join(IMAGES_DIR, filename), (error) => {
    if (error) return next(error);

    logger.info({ filename }, 'Image uploaded');
    return res.status(200).json({
      success: true,
      message: 'File uploaded!',
      file: filename
    });
  });
};

module.exports = { uploadImage };
