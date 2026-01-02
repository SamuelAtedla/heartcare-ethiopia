const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../v1/middleware/auth');
const appointmentController = require('../controllers/appointmentController');
const upload = require('../v1/middleware/upload'); // Your multer config

// --- PUBLIC ---
router.get('/availability', appointmentController.getAvailableSlots);

// --- PATIENT
router.post('/book', authenticate, appointmentController.createPendingAppointment);
router.get('/my-appointment', authenticate, appointmentController.getPatientHistory);


router.post(
  '/:appointmentId/upload-results',
  authenticate,
  upload.array('labResults', 5), // 'labResults' is the field name from React
  appointmentController.uploadLabResults
);

// --- DOCTOR ONLY ---
router.get('/queue', authenticate, authorize('doctor'), appointmentController.getDoctorQueue);
router.post('/:id/clinical-notes', authenticate, authorize('doctor'), appointmentController.addClinicalNotes);

module.exports = router;