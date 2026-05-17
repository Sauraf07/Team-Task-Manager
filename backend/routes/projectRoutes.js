const express = require('express');
const { createProject, getProjects, addMember } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get projects (both Admin and Member can access, logic handled in controller)
router.get('/', protect, getProjects);

// Create a project (Admin only)
router.post('/', protect, authorize('Admin'), createProject);

// Add member to project (Admin only)
router.post('/:id/members', protect, authorize('Admin'), addMember);

module.exports = router;
