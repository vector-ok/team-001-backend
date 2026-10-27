const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'images');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype] || path.extname(file.originalname).replace('.', '') || 'bin';
    const base = path.basename(file.originalname, path.extname(file.originalname)).split(' ').join('_');

    callback(null, `${base}_${Date.now()}.${extension}`);
  }
});

module.exports = multer({ storage }).single('image');
