const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { authenticate, authorize } = require("../middleware/auth");

router.get(
  "/dashboard",
  authenticate,
  authorize("patient"),
  patientController.getPatientHistory
);

router.put(
  "/profile",
  authenticate,
  authorize("patient"),
  patientController.updateProfile
);

module.exports = router;
