// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authenticate, authorize } = require("../middleware/auth");

// This route is only accessible to the Specialist
router.get(
  "/dashboard",
  authenticate,
  authorize("doctor"),
  doctorController.getDailySchedule
);

// Patient records are strictly for the Specialist
router.get(
  "/patient-records/:id",
  authenticate,
  authorize("doctor"),
  doctorController.getDetailedHistory
);

module.exports = router;
