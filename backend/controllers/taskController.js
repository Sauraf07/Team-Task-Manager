const { Task, Project, User, Comment } = require('../models');

// @desc    Create a new task and assign to user
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assignedTo, priority } = req.body;

    // Verify project and user exist
    const project = await Project.findByPk(projectId);
    const user = await User.findByPk(assignedTo);

    if (!project || !user) {
      return res.status(404).json({ message: 'Project or User not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      projectId,
      assignedTo,
      priority: priority || 'Medium'
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    let tasks;
    const includeQuery = [
      { model: Project, as: 'project' },
      { model: User, as: 'assignee', attributes: ['id', 'name'] },
      { 
        model: Comment, 
        as: 'comments', 
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }] 
      }
    ];

    if (req.user.role === 'Admin') {
      tasks = await Task.findAll({ include: includeQuery });
    } else {
      tasks = await Task.findAll({ 
        where: { assignedTo: req.user.id },
        include: includeQuery
      });
    }
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only allow Admin or the assigned Member to update
    if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    task.status = status;
    await task.save();

    res.json({ message: 'Task status updated', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Add a comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId = req.params.id;

    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const task = await Task.findByPk(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Restrict comment access if Member is not assigned
    if (req.user.role !== 'Admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    const comment = await Comment.create({
      text,
      taskId,
      userId: req.user.id
    });

    // Fetch the saved comment with user details to return to frontend
    const savedComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'role'] }]
    });

    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};
