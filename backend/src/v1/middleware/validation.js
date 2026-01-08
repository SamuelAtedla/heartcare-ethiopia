const Joi = require('joi');
const logger = require('../../utils/logger');

/**
 * Validation middleware factory
 * Creates middleware that validates request body against a Joi schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            logger.warn({
                message: 'Validation failed',
                path: req.path,
                errors: error.details.map(d => ({ field: d.path[0], message: d.message }))
            });

            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(d => ({
                    field: d.path[0],
                    message: d.message
                }))
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

// Validation Schemas
const schemas = {
    register: Joi.object({
        fullName: Joi.string().min(3).max(100).required()
            .messages({
                'string.min': 'Full name must be at least 3 characters',
                'string.max': 'Full name must not exceed 100 characters',
                'any.required': 'Full name is required'
            }),
        phone: Joi.string().pattern(/^09\d{8}$/).required()
            .messages({
                'string.pattern.base': 'Phone must be 10 digits starting with 09',
                'any.required': 'Phone number is required'
            }),
        email: Joi.string().email().optional().allow('', null)
            .messages({
                'string.email': 'Please provide a valid email address'
            }),
        password: Joi.string().min(8).required()
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'any.required': 'Password is required'
            }),
        role: Joi.string().valid('patient', 'doctor').optional(),
        age: Joi.number().integer().min(1).max(150).optional()
            .messages({
                'number.min': 'Age must be at least 1',
                'number.max': 'Age must not exceed 150'
            }),
        caseDescription: Joi.string().max(1000).optional()
    }),

    login: Joi.object({
        phone: Joi.string().required()
            .messages({
                'any.required': 'Phone number is required'
            }),
        password: Joi.string().required()
            .messages({
                'any.required': 'Password is required'
            })
    }),

    createAppointment: Joi.object({
        doctorId: Joi.string().uuid().required()
            .messages({
                'string.guid': 'Invalid doctor ID format',
                'any.required': 'Doctor ID is required'
            }),
        scheduledAt: Joi.date().iso().greater('now').required()
            .messages({
                'date.greater': 'Appointment must be scheduled for a future date',
                'any.required': 'Scheduled time is required'
            }),
        symptoms: Joi.string().max(2000).optional().allow('', null),
        communicationMode: Joi.string().valid('whatsapp', 'telegram', 'zoom').optional(),
        patientPhone: Joi.string().pattern(/^09\d{8}$/).optional()
    }),

    updateProfile: Joi.object({
        fullName: Joi.string().min(3).max(100).optional(),
        email: Joi.string().email().optional().allow('', null),
        age: Joi.number().integer().min(1).max(150).optional(),
        bio: Joi.string().max(1000).optional(),
        specialty: Joi.string().max(200).optional(),
        credentials: Joi.string().max(1000).optional()
    }),

    clinicalNotes: Joi.object({
        notes: Joi.string().max(5000).required()
            .messages({
                'any.required': 'Clinical notes are required'
            })
    })
};

module.exports = {
    validate,
    schemas
};
