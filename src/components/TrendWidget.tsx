// src/components/TrendWidget.tsx
import { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, Box,
  FormControl, InputLabel, Select, MenuItem,
  LinearProgress, Alert
} from '@mui/material';
import {
  ResponsiveContainer, LineChart as RLineChart,
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { getTrend, TrendResp } from '../services/reports';

type Gran = 'day' | 'week' | 'month';

export default function TrendWidget() {
  const [gran, setGran] = useState<Gran>('week');
  const [data, setData] = useState<TrendResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async (g: Gran) => {
    try {
      setLoading(true);
      setErr(null);
      const resp = await getTrend({ granularity: g }); // ← datos del backend
      setData(resp);
    } catch {
      setErr('No se pudo cargar la tendencia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(gran);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gran]);

  const chartData = (data?.series ?? []).map(s => ({
    period: s.period,
    total: s.total,
  }));

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title="Gasto — Tendencia"
        subheader={data ? `Granularidad: ${data.filters.granularity}` : ''}
        action={
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Granularidad</InputLabel>
            <Select
              label="Granularidad"
              value={gran}
              onChange={(e) => setGran(e.target.value as Gran)}
            >
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="week">Semana</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
            </Select>
          </FormControl>
        }
      />
      {loading && <LinearProgress />}
      <CardContent>
        {err && <Alert severity="error">{err}</Alert>}

        {!err && chartData.length === 0 && (
          <Alert severity="info">Sin datos para la selección actual.</Alert>
        )}

        {!err && chartData.length > 0 && (
          <Box sx={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" dot={false} />
              </RLineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
