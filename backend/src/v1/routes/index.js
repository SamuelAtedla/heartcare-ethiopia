const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const webhookRoutes = require('./webhookRoutes');
const publicRoutes = require('./publicRoutes');

// Categorized Middlewares
const { authenticate, authorize } = require('../middleware/auth');

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/appointments', authenticate, appointmentRoutes);
router.use('/patient', authenticate, patientRoutes);
router.use('/doctor', authenticate, authorize('doctor'), doctorRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;