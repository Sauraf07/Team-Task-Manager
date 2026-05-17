const { Task, Project, User } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let totalProjects = 0;
    let tasks = [];

    if (role === 'Admin') {
      totalProjects = await Project.count();
      tasks = await Task.findAll({
        include: [{ model: Project, as: 'project', attributes: ['name'] }]
      });
    } else {
      // Member logic
      const user = await User.findByPk(userId, {
        include: [{ model: Project, as: 'projects' }]
      });
      totalProjects = user.projects ? user.projects.length : 0;

      tasks = await Task.findAll({
        where: { assignedTo: userId },
        include: [{ model: Project, as: 'project', attributes: ['name'] }]
      });
    }

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    
    // Calculate Overdue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'Completed') return false;
      const dueDate = new Date(t.dueDate);
      return dueDate < today;
    }).length;

    // Get 5 most recent tasks (sorted by id desc for simplicity, or createdAt)
    const recentTasks = tasks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};
