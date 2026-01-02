const express = require('express');
const security = require('./src/v1/middleware/security');
const sequelize = require('./src/config/database');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();
app.use(express.json());

// Apply Security
security(app);

// Routes
app.use('/V1/appointment', appointmentRoutes);

// Sync Database and Start
sequelize.sync().then(() => {
  app.listen(5000, () => console.log('Heart Care Backend Securely Running on Port 5000'));
});