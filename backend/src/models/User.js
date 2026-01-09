// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  phone: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient', 'doctor'), defaultValue: 'patient' },
  age: { type: DataTypes.INTEGER }, // Added for patient profile
  // Specialist Specific Fields
  specialty: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  credentials: { type: DataTypes.TEXT },
  profileImage: { type: DataTypes.STRING },
  passwordResetToken: { type: DataTypes.STRING },
  passwordResetExpires: { type: DataTypes.DATE }
});

module.exports = User;