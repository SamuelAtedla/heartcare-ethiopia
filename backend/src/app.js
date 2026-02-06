const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const v1Router = require('./v1/routes/index');
const errorHandler = require('./v1/middleware/errorHandler');
const logger = require('./utils/logger');

const path = require('path');

const app = express();

//IMPORTANT, INSTEAD OF SEEING THE IP OF THE DOCKER CONTAINER, IT WILL SHOW THE IP OF THE CLIENT
app.set('trust proxy', 1);
// --- GLOBAL MIDDLEWARE & SECURITY ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = [
    'https://heartcareethiopia.com',
    'https://www.heartcareethiopia.com',
    'http://localhost:5173',
    'http://localhost:5000'
];
// CORS Configuration - Only allow frontend origin
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },//process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
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

// Centralized Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
