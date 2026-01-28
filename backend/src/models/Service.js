// src/models/Service.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Service = sequelize.define('Service', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    iconName: { type: DataTypes.STRING, defaultValue: 'Stethoscope' }, // Lucide icon name
    titleEn: { type: DataTypes.STRING, allowNull: false },
    titleAm: { type: DataTypes.STRING, allowNull: false },
    descriptionEn: { type: DataTypes.TEXT, allowNull: false },
    descriptionAm: { type: DataTypes.TEXT, allowNull: false },
    featuresEn: { type: DataTypes.JSON, defaultValue: [] },
    featuresAm: { type: DataTypes.JSON, defaultValue: [] },
    order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Service;
