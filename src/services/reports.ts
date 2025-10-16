// src/services/reports.ts
import api from './api';

export type TrendParams = {
  start?: string;                 // 'YYYY-MM-DD' opcional
  end?: string;                   // 'YYYY-MM-DD' opcional
  granularity?: 'day' | 'week' | 'month'; // default backend: 'week'
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