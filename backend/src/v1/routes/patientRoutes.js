const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

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
  upload.single('profileImage'),
  patientController.updateProfile
);

module.exports = router;
