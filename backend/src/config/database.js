const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false, // Prevents leaking query data in logs
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;