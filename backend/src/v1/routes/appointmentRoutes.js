const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');
const upload = require('../middleware/upload'); // Your multer config

// --- PUBLIC ---
router.get('/availability', appointmentController.getAvailableSlots);

// --- PATIENT
router.post('/book', authenticate, appointmentController.createPendingAppointment);
router.get('/my-appointment', authenticate, appointmentController.getPatientHistory);

router.post(
  '/:appointmentId/upload-receipt',
  authenticate,
  upload.single('receipt'),
  appointmentController.uploadPaymentReceipt
);

router.post(
  '/:appointmentId/upload-results',
  authenticate,
  upload.array('labResults', 5),
  appointmentController.uploadLabResults
);

// --- DOCTOR ONLY ---
router.get('/queue', authenticate, appointmentController.getDoctorQueue);
router.post('/:id/clinical-notes', authenticate, appointmentController.addClinicalNotes);
router.post('/approve-payment', authenticate, appointmentController.approvePayment);
/*router.get('/queue', authenticate, authorize('doctor'), appointmentController.getDoctorQueue);
router.post('/:id/clinical-notes', authenticate, authorize('doctor'), appointmentController.addClinicalNotes);
router.post('/approve-payment', authenticate, authorize('doctor'), appointmentController.approvePayment);
*/
module.exports = router;