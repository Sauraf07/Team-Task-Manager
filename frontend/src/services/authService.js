import api from './api';

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.data) {
    // Optionally auto-login, but usually we just return the response
    // For this app, backend doesn't send token on signup, so they must login after
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getAllUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
};

export default authService;
