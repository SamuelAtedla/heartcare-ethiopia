const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// --- PUBLIC ---
router.get('/availability', appointmentController.getAvailableSlots);

// --- PATIENT ONLY ---
router.post('/book', authenticate, appointmentController.createPendingAppointment);
router.get('/my-appointments', authenticate, appointmentController.getPatientHistory);

// --- DOCTOR ONLY ---
router.get('/queue', authenticate, authorize('doctor'), appointmentController.getDoctorQueue);
router.post('/:id/clinical-notes', authenticate, authorize('doctor'), appointmentController.saveNotes);

module.exports = router;