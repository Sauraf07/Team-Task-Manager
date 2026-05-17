const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectMember = sequelize.define(
  'ProjectMember',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'projectmembers',
    timestamps: true,
  }
);

module.exports = ProjectMember;