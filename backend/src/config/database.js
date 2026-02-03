const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // Full Database Name
  process.env.DB_USER,        // Full Username
  process.env.DB_PASSWORD,           // The password you just created
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    logging: console.log,   // This will show SQL in your logs
  }
);

/*const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // Prevents leaking query data in logs
  define: {
    timestamps: true,
    underscored: true,
  },
});*/

module.exports = sequelize;