const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientPhone: { type: DataTypes.STRING, allowNull: false },
  communicationMode: {
    type: DataTypes.ENUM('whatsapp', 'telegram', 'zoom'),
    defaultValue: 'whatsapp'
  },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending_payment', 'confirmed', 'completed', 'cancelled', 'pending_approval'),
    defaultValue: 'pending_payment'
  },
  paymentReference: { type: DataTypes.STRING, unique: true },
  attachmentPath: { type: DataTypes.STRING }, // Store path, not the file
  symptoms: { type: DataTypes.TEXT },
  clinicalNotes: { type: DataTypes.TEXT }
});

module.exports = Appointment;