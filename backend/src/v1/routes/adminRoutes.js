const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Assuming this exists or uses multer

const router = express.Router();

// Protect all routes
router.use(authenticate);
router.use(authorize('admin'));

router.post('/doctors', upload.single('profileImage'), adminController.createDoctor);

module.exports = router;
