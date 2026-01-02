//import dotenv from 'dotenv';
//import express from 'express';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./src/config/database');

// Import the Version 1 Router
const v1Router = require('./src/v1/routes/index');

const app = express();

// --- GLOBAL MIDDLEWARE & SECURITY ---
app.use(helmet()); // Protects headers
app.use(cors());   // Allows React frontend to connect
app.use(express.json()); // Parses JSON bodies

// DDoS & Brute Force Protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes."
});// 15 minutes Limit each IP to 100 requests per window
app.use('/', limiter);

// --- API VERSIONING ---
// All routes will now start with /api/v1/
app.use('/v1', v1Router);

// Root health check
app.get('/', (req, res) => {
  res.send('Heart Care Ethiopia API (v1) is running securely.');
});

// --- DATABASE & SERVER START ---
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // 'alter: true' during dev, 'false' in prod
  .then(() => {
    app.listen(PORT, () => {
      console.log(`-----------------------------------------------`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Version 1 API: http://localhost:${PORT}/v1`);
      console.log(`-----------------------------------------------`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });