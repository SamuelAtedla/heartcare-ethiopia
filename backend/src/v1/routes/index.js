const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const webhookRoutes = require('./webhookRoutes');
const publicRoutes = require('./publicRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const adminRoutes = require('./adminRoutes');
const serviceRoutes = require('./serviceRoutes');


// Categorized Middlewares
const { authenticate, authorize } = require('../middleware/auth');

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/appointments', authenticate, appointmentRoutes);
router.use('/patient', authenticate, patientRoutes);
router.use('/doctor', authenticate, doctorRoutes);
router.use('/availability', authenticate, availabilityRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/admin', authenticate, adminRoutes); // Admin routes (protected)
router.use('/services', serviceRoutes);


module.exports = router;