const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/articles', publicController.getArticles);
router.get('/doctors', publicController.getDoctors);

module.exports = router;
