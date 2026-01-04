const express = require('express');
const router = express.Router();

// TODO: Implement Webhook Routes (Chapa, etc.)
router.post('/chapa', (req, res) => res.status(501).json({ message: 'Not Implemented' }));

module.exports = router;
