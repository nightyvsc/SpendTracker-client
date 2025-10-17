// src/services/reports.ts
import api from './api';

export type TrendParams = {
  start?: string; // 'YYYY-MM-DD'
  end?: string;   // 'YYYY-MM-DD'
  granularity?: 'day' | 'week' | 'month'; // backend default: 'week'
};

export type TrendResp = {
  filters: {
    start: string | null;
    end: string | null;
    granularity: 'day' | 'week' | 'month';
  };
  series: { period: string; total: number }[];
};

export async function getTrend(params: TrendParams = {}) {
  const { data } = await api.get<TrendResp>('/api/reports/trend/', { params });
  return data;
}
