require('dotenv').config();
const sequelize = require('./src/config/database');
const app = require('./src/app');
const { seedInitialData } = require('./src/utils/seed');
const logger = require('./src/utils/logger');

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_HOST', 'PORT'];
const missing = requiredEnvVars.filter(v => !process.env[v]);

if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Database Sync & Server Start
sequelize.sync({ alter: true })
    .then(async () => {
        // Seed initial data
        await seedInitialData();

        const server = app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
            console.log(`-----------------------------------------------`);
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/v1`);
            console.log(`-----------------------------------------------`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            logger.info(`${signal} signal received: closing HTTP server`);
            server.close(() => {
                logger.info('HTTP server closed');
                sequelize.close().then(() => {
                    logger.info('Database connection closed');
                    process.exit(0);
                });
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    })
    .catch(err => {
        logger.error('Unable to connect to the database:', err);
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    });
