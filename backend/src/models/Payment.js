// src/models/Payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = sequelize.define('Payment', {
  tx_ref: { type: DataTypes.STRING, primaryKey: true },
  appointmentId: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3000 },
  method: {
    type: DataTypes.ENUM('gateway', 'manual_transfer'),
    defaultValue: 'gateway'
  },
  receiptPath: { type: DataTypes.STRING }, // Path to the screenshot of the bank receipt
  status: {
    type: DataTypes.ENUM('initiated', 'pending_verification', 'success', 'failed'),
    defaultValue: 'initiated'
  }
});