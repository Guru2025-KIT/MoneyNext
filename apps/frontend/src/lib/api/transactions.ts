import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const transactionsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (data: any) => {
    const response = await axios.post(`${API_URL}/transactions`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await axios.patch(`${API_URL}/transactions/${id}`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/transactions/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(`${API_URL}/transactions/stats`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};