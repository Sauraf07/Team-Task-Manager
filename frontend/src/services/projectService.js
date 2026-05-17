import api from './api';

const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

const getProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

const addMemberToProject = async (projectId, userId) => {
  const response = await api.post(`/projects/${projectId}/members`, { userId });
  return response.data;
};

const updateProjectStatus = async (projectId, status) => {
  const response = await api.put(`/projects/${projectId}/status`, { status });
  return response.data;
};

const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

const projectService = {
  createProject,
  getProjects,
  addMemberToProject,
  updateProjectStatus,
  deleteProject,
};

export default projectService;
