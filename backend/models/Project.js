const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Completed', 'On Hold'),
    defaultValue: 'Active',
  },
  dueDate: {
    type: DataTypes.DATE,
  }
}, {
  timestamps: true,
});

module.exports = Project;
