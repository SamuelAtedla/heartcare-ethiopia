// src/routes/main.js
const express = require('express');
const router = express.Router();

//const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes');
//const webhookRoutes = require('./webhookRoutes');

// Categorized Middlewares
const { authenticate, authorize } = require('../middleware/auth');

//router.use('/auth', authRoutes);                      // Public & Auth
router.use('/appointments', appointmentRoutes);
router.use('/patient', authenticate, patientRoutes);  // Patient Only
router.use('/doctor', authenticate, authorize('doctor'), doctorRoutes); // Specialist Only
//router.use('/webhooks', webhookRoutes);               // Gateway Only (Chapa/Telebirr)

module.exports = router;