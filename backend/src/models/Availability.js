// src/models/Availability.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Availability = sequelize.define('Availability', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    dayOfWeek: {
        type: DataTypes.INTEGER, // 0 (Sun) to 6 (Sat)
        allowNull: false,
        validate: { min: 0, max: 6 }
    },
    startTime: {
        type: DataTypes.STRING, // HH:mm
        allowNull: false,
        defaultValue: '09:00'
    },
    endTime: {
        type: DataTypes.STRING, // HH:mm
        allowNull: false,
        defaultValue: '17:00'
    },
    slotDuration: {
        type: DataTypes.INTEGER, // in minutes
        defaultValue: 30
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Availability;
