const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    titleEn: { type: DataTypes.STRING, allowNull: false },
    titleAm: { type: DataTypes.STRING, allowNull: false },
    contentEn: { type: DataTypes.TEXT, allowNull: false },
    contentAm: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING },
    attachment: { type: DataTypes.STRING },
    published: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Article;
