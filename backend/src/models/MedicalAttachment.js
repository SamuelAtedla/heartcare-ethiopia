const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalAttachment = sequelize.define('MedicalAttachment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  // THIS IS THE LINK (The Foreign Key)
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Appointments', // Name of the target table
      key: 'id'              // Column in the target table
    },
    onDelete: 'CASCADE'      // If appointment is deleted, delete files too
  },
  fileName: { type: DataTypes.STRING, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  fileType: { type: DataTypes.STRING }
});

module.exports = MedicalAttachment;