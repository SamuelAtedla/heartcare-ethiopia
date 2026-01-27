const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticate, authorize } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// Allow Finance and Admin roles to access transaction views
router.get('/transactions', authorize('admin', 'finance'), financeController.getAllTransactions);

module.exports = router;
