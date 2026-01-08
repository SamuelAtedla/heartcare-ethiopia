const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const v1Router = require('./v1/routes/index');

const path = require('path');

const app = express();

// --- GLOBAL MIDDLEWARE & SECURITY ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// DDoS & Brute Force Protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes."
});
app.use('/', limiter);

// --- API VERSIONING ---
app.use('/v1', v1Router);

// Root health check
app.get('/', (req, res) => {
    res.send('Heart Care Ethiopia API is running safely. On docker also.');
});

module.exports = app;
