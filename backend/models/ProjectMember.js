const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// This acts as a junction table for the Many-to-Many relationship between Projects and Users
const ProjectMember = sequelize.define('projectmember', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // Custom fields can be added here if needed, like 'role_in_project'
}, {
  timestamps: true,
  freezeTableName: true
});

module.exports = ProjectMember;