import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

console.log('Auth API URL:', API_URL);

export const authApi = {
  signup: async (data: any) => {
    try {
      const url = `${API_URL}/signup`;
      console.log('Signup request to:', url);
      console.log('Signup data:', data);
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('Signup response:', response.data);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  login: async (data: any) => {
    try {
      const url = `${API_URL}/login`;
      console.log('Login request to:', url);
      console.log('Login data:', data);
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('Login response:', response.data);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
};
