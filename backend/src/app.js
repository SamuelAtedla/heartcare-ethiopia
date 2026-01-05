const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const v1Router = require('./v1/routes/index');

const app = express();

// --- GLOBAL MIDDLEWARE & SECURITY ---
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// DDoS & Brute Force Protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use('/', limiter);

// --- API VERSIONING ---
app.use('/v1/routes', v1Router);

// Root health check
app.get('/', (req, res) => {
    res.send('Heart Care Ethiopia API (v1) is running securely.');
});

module.exports = app;
