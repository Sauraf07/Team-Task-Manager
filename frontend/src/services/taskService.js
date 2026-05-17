import api from './api';

const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

const updateTaskStatus = async (taskId, status) => {
  const response = await api.put(`/tasks/${taskId}/status`, { status });
  return response.data;
};

const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

const addCommentToTask = async (taskId, text) => {
  const response = await api.post(`/tasks/${taskId}/comments`, { text });
  return response.data;
};

const taskService = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  addCommentToTask,
};

export default taskService;
