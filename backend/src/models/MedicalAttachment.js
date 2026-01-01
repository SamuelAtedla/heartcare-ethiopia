const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalAttachment = sequelize.define('MedicalAttachment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fileName: { type: DataTypes.STRING, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING }
});

module.exports = MedicalAttachment;