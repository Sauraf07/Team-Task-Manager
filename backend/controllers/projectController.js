const { Project, User, ProjectMember } = require('../models');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    const project = await Project.create({
      name,
      description,
      dueDate,
      createdBy: req.user.id
    });

    // Automatically add the creator as a member of the project
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
};

// @desc    Get all projects (Admin) or assigned projects (Member)
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Admin') {
      // Admin sees all projects, including the members assigned to them
      projects = await Project.findAll({
        include: [{ model: User, as: 'members', attributes: ['id', 'name', 'email'] }]
      });
    } else {
      // Member sees only projects they are a part of
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Project,
          as: 'projects',
          include: [{ model: User, as: 'members', attributes: ['id', 'name'] }]
        }]
      });
      projects = user.projects;
    }

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

// @desc    Add a member to a project
// @route   POST /api/projects/:id/members
// @access  Private/Admin
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);
    const user = await User.findByPk(userId);

    if (!project || !user) {
      return res.status(404).json({ message: 'Project or User not found' });
    }

    // Check if already a member
    const existingMember = await ProjectMember.findOne({
      where: { projectId, userId }
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    await ProjectMember.create({ projectId, userId });

    res.status(201).json({ message: 'Member added to project successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding member' });
  }
};

// @desc    Update project status
// @route   PUT /api/projects/:id/status
// @access  Private/Admin
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.status = status;
    await project.save();

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating project status' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'Completed') {
      return res.status(400).json({ message: 'Only completed projects can be deleted' });
    }

    await project.destroy();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
