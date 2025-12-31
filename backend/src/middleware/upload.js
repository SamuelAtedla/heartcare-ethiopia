const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'storage/private/medical_records', // Outside public web root
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpg|jpeg|png/;
  const isSafe = allowed.test(path.extname(file.originalname).toLowerCase());
  if (isSafe) return cb(null, true);
  cb(new Error("Unsafe file type. Only PDF/Images allowed."));
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });