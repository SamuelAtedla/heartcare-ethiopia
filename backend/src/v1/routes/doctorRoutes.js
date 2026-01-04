// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const articleController = require("../controllers/articleController");
const { authenticate, authorize } = require("../middleware/auth");

// This route is only accessible to the Specialist
router.get(
  "/dashboard",
  authenticate,
  authorize("doctor"),
  doctorController.getDailySchedule
);

// Article Management
router.post(
  "/articles",
  authenticate,
  authorize("doctor"),
  articleController.createArticle
);

router.get(
  "/articles",
  authenticate,
  authorize("doctor"),
  articleController.getMyArticles
);

router.put(
  "/articles/:id",
  authenticate,
  authorize("doctor"),
  articleController.updateArticle
);

router.delete(
  "/articles/:id",
  authenticate,
  authorize("doctor"),
  articleController.deleteArticle
);

// Patient records are strictly for the Specialist
router.get(
  "/patient-records/:id",
  authenticate,
  authorize("doctor"),
  doctorController.getDetailedHistory
);

module.exports = router;
