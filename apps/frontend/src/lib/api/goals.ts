import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const goalsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/goals`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/goals`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await axios.patch(`${API_URL}/goals/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/goals/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  contribute: async (id: string, amount: number) => {
    const response = await axios.post(`${API_URL}/goals/${id}/contribute`, 
      { amount },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getProgress: async (id: string) => {
    const response = await axios.get(`${API_URL}/goals/${id}/progress`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};