require('dotenv').config();
const sequelize = require('./src/config/database');
const app = require('./src/app');
const { seedDefaultDoctor } = require('./src/utils/seed');

const PORT = process.env.PORT || 5000;

// Database Sync & Server Start
sequelize.sync({ alter: true })
  .then(async () => {
    // Seed default data
    await seedDefaultDoctor();

    app.listen(PORT, () => {
      console.log(`-----------------------------------------------`);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/v1`);
      console.log(`-----------------------------------------------`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });