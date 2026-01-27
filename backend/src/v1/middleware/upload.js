const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure storage directories exist
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'storage/';

    if (file.fieldname === 'profilePhoto' || file.fieldname === 'profileImage') {
      uploadPath += 'profiles/';
    } else if (file.fieldname === 'receipt') {
      uploadPath += 'receipts/';
    } else if (file.fieldname === 'labResults') {
      uploadPath += 'lab_results/';
    } else if (file.fieldname === 'articleImage' || file.fieldname === 'attachment') {
      uploadPath += 'articles/';
    } else {
      uploadPath += 'others/';
    }

    createDir(path.join(__dirname, '../../../', uploadPath));
    cb(null, path.join(__dirname, '../../../', uploadPath));
  },
  filename: function (req, file, cb) {
    // Secure filename: timestamp + random + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File Filter (Security)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || (file.fieldname === 'attachment'); // Relax mimetype check for docs if needed, or stick to extname

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images, PDFs, and document files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

module.exports = upload;