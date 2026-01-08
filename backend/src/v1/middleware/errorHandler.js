const logger = require('../utils/logger');

/**
 * Centralized error handling middleware
 * Handles different types of errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id
    });

    // Sequelize Validation Errors
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Sequelize Unique Constraint Errors
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            error: 'A record with this value already exists',
            field: err.errors[0]?.path
        });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid authentication token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Authentication token has expired' });
    }

    // Multer Errors (File Upload)
    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'File upload error',
            message: err.message
        });
    }

    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : err.message;

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
