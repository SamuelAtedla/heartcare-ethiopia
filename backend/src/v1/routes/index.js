// src/routes/main.js
const express = require('express');
const router = express.Router();

//const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const webhookRoutes = require('./webhookRoutes');
const publicRoutes = require('./publicRoutes');

// Categorized Middlewares
const { authenticate, authorize } = require('../middleware/auth');

router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/doctor', doctorRoutes);
router.use('/patient', patientRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/public', publicRoutes);                      // Public & Auth
router.use('/appointments', appointmentRoutes);
router.use('/patient', authenticate, patientRoutes);  // Patient Only
router.use('/doctor', authenticate, authorize('doctor'), doctorRoutes); // Specialist Only
//router.use('/webhooks', webhookRoutes);               // Gateway Only (Chapa/Telebirr)

module.exports = router;