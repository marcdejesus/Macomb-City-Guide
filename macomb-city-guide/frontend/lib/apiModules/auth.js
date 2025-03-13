import api from '../api';

export const loginUser = async (credentials) => {
  const response = await api.post('/token/', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/users/register/', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users/profile/');
  return response.data;
};