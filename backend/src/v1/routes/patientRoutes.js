// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { authenticate, authorize } = require("../middleware/auth");

// This route is only accessible to the patient themselves
router.get(
  "/dashboard",
  authenticate,
  authorize("patient"),
  patientController.getPatientHistory
);

module.exports = router;
