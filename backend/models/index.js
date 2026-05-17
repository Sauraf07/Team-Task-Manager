const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');
const Comment = require('./Comment');

// Define Relationships

// 1. A User (Admin) creates a Project (One-to-Many)
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// 2. A Project has many Users (Members) and a User can be in many Projects (Many-to-Many)
Project.belongsToMany(User, { through: ProjectMember, as: 'members', foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectMember, as: 'projects', foreignKey: 'userId' });

// 3. A Project has many Tasks (One-to-Many)
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// 4. A Task is assigned to a User (One-to-Many)
// Task -> User (Assignee)
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });

// Task -> Comment (One-to-Many)
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

// User -> Comment (One-to-Many)
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  ProjectMember,
  Comment
};
