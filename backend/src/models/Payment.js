// src/models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports =sequelize.define('Payment', {
  tx_ref: { type: DataTypes.STRING, primaryKey: true }, // The unique transaction reference
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'ETB' },
  status: { type: DataTypes.ENUM('initiated', 'success', 'failed'), defaultValue: 'initiated' }
});