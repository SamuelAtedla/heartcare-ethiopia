const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientPhone: { type: DataTypes.STRING, allowNull: false },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending_payment', 'confirmed', 'completed'),
    defaultValue: 'pending_payment'
  },
  paymentReference: { type: DataTypes.STRING, unique: true },
  attachmentPath: { type: DataTypes.STRING } // Store path, not the file
});

module.exports = Appointment;