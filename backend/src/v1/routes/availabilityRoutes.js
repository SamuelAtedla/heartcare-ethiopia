const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { authorize } = require('../middleware/auth');

// All availability routes require doctor role
router.use(authorize('doctor'));

router.get('/', availabilityController.getAvailability);
router.post('/', availabilityController.updateAvailability);
router.post('/bulk', availabilityController.bulkUpdateAvailability);

module.exports = router;
