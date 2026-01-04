const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const upload = require('../middleware/upload');

// Register: Handle multipart form (photo upload)
router.post('/register', upload.single('profilePhoto'), authController.register);

// Login: JSON body
router.post('/login', authController.login);

module.exports = router;
