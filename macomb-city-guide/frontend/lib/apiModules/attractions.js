import api from '../api';

export const getAttractions = async (params = {}) => {
  const response = await api.get('/attractions/', { params });
  return response.data;
};

export const getAttraction = async (id) => {
  const response = await api.get(`/attractions/${id}/`);
  return response.data;
};

export const getFeaturedAttractions = async () => {
  const response = await api.get('/attractions/?featured=true');
  return response.data;
};