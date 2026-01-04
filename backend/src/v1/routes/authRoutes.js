const express = require('express');
const router = express.Router();

// TODO: Implement Auth Routes (Register, Login)
router.post('/register', (req, res) => res.status(501).json({ message: 'Not Implemented' }));
router.post('/login', (req, res) => res.status(501).json({ message: 'Not Implemented' }));

module.exports = router;
