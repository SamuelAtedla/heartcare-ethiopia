// Application Configuration Constants

module.exports = {
    // Appointment Configuration
    APPOINTMENT: {
        SLOT_DURATION_MINUTES: 30,
        WORKING_HOURS: {
            START: 9,  // 9 AM
            END: 17    // 5 PM
        },
        CONSULTATION_FEE: 500 // ETB
    },

    // Authentication Configuration
    AUTH: {
        BCRYPT_ROUNDS: 12,
        PASSWORD_MIN_LENGTH: 8
    },

    // File Upload Configuration
    UPLOAD: {
        MAX_FILE_SIZE: 5242880, // 5MB in bytes
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
        ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png']
    },

    // Rate Limiting
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
        AUTH_MAX_ATTEMPTS: 5
    }
};
