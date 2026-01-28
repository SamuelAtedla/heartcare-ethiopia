// src/v1/routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route to get all services
router.get('/', serviceController.getAllServices);

// Admin-only routes for management
router.post('/', authenticate, authorize('admin'), serviceController.createService);
router.put('/:id', authenticate, authorize('admin'), serviceController.updateService);
router.delete('/:id', authenticate, authorize('admin'), serviceController.deleteService);

module.exports = router;
