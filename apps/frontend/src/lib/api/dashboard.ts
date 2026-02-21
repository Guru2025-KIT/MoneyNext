import { apiClient } from './client';

export const dashboardApi = {
  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },

  getMonthlyTrend: async () => {
    const response = await apiClient.get('/dashboard/monthly-trend');
    return response.data;
  },

  getCategoryBreakdown: async () => {
    const response = await apiClient.get('/dashboard/category-breakdown');
    return response.data;
  },

  getRecentTransactions: async () => {
    const response = await apiClient.get('/dashboard/recent-transactions');
    return response.data;
  },
};
