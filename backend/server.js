require('dotenv').config();
const sequelize = require('./src/config/database');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
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