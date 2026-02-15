// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CONSTANTS = require('../config/constants');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'doctor'), defaultValue: 'patient' },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: true }, // Default true for patients, overridden for doctors
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  age: { type: DataTypes.INTEGER }, // Added for patient profile
  // Specialist Specific Fields
  specialty: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  credentials: { type: DataTypes.TEXT },
  profileImage: { type: DataTypes.STRING },
  professionalFee: { type: DataTypes.INTEGER, defaultValue: CONSTANTS.APPOINTMENT.CONSULTATION_FEE },
  passwordResetToken: { type: DataTypes.STRING },
  passwordResetExpires: { type: DataTypes.DATE }
});

// Hook to set isApproved=false for doctors by default
User.beforeCreate(async (user) => {
  if (user.role === 'doctor' && user.isApproved === undefined) {
    user.isApproved = false;
  }
});

module.exports = User;