const express = require('express');
const { getTasks, createTask, updateTaskStatus, deleteTask, addComment } = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get tasks (Admin sees all, Member sees assigned)
router.get('/', protect, getTasks);

// Create task (Admin only)
router.post('/', protect, authorize('Admin'), createTask);

// Update task status (Admin or Assigned Member)
router.put('/:id/status', protect, updateTaskStatus);

// Delete task (Admin only)
router.delete('/:id', protect, authorize('Admin'), deleteTask);

// Add comment to task (Any authorized user)
router.post('/:id/comments', protect, addComment);

module.exports = router;
