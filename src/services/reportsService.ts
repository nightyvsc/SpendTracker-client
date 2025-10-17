import api from './api';

export const ReportsService = {
  async getSummary(params?: { start?: string; end?: string; daily_limit?: number; monthly_limit?: number }) {
    const { data } = await api.get('/api/reports/summary/', { params });
    return data;
  },

  async getByCategory(params?: { start?: string; end?: string; include_uncategorized?: boolean; top_n?: number }) {
    const { data } = await api.get('/api/reports/by-category/', { params });
    return data;
  },
};
