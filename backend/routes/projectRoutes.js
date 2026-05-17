const express = require('express');
const { createProject, getProjects, addMember, updateProjectStatus, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get projects (both Admin and Member can access, logic handled in controller)
router.get('/', protect, getProjects);

// Create a project (Admin only)
router.post('/', protect, authorize('Admin'), createProject);

// Add member to project (Admin only)
router.post('/:id/members', protect, authorize('Admin'), addMember);

// Update project status (Admin only)
router.put('/:id/status', protect, authorize('Admin'), updateProjectStatus);

// Delete project (Admin only)
router.delete('/:id', protect, authorize('Admin'), deleteProject);

module.exports = router;
