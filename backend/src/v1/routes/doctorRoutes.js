// src/routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const articleController = require("../controllers/articleController");
const upload = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");

// This route is only accessible to the Specialist
router.get(
  "/queue",
  authenticate,
  //authorize("doctor"),
  doctorController.getConfirmedQueue
);

// Article Management
router.post(
  "/articles",
  authenticate,
  upload.single('articleImage'),
  //authorize("doctor"),
  articleController.createArticle
);

router.get(
  "/articles",
  authenticate,
  //authorize("doctor"),
  articleController.getMyArticles
);

router.put(
  "/articles/:id",
  authenticate,
  upload.single('articleImage'),
  //authorize("doctor"),
  articleController.updateArticle
);

router.delete(
  "/articles/:id",
  authenticate,
  //authorize("doctor"),
  articleController.deleteArticle
);

// Patient records are strictly for the Specialist
router.get(
  "/patient-records/:patientId",
  authenticate,
  //authorize("doctor"),
  doctorController.getDetailedHistory
);

router.get(
  "/search-patients",
  authenticate,
  //authorize("doctor"),
  doctorController.searchPatients
);

router.get(
  "/finance",
  authenticate,
  //authorize("doctor"),
  doctorController.getFinanceRecords
);

// Profile Management
router.get(
  "/profile",
  authenticate,
  //authorize("doctor"),
  doctorController.getProfile
);

router.put(
  "/profile",
  authenticate,
  upload.single('profileImage'),
  //authorize("doctor"),
  doctorController.updateProfile
);

module.exports = router;
