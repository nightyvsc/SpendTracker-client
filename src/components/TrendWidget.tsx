// src/components/TrendWidget.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Box, FormControl, InputLabel, Select, MenuItem, LinearProgress, Alert } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
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
      const resp = await getTrend({ granularity: g });
      setData(resp);
    } catch (e) {
      setErr('No se pudo cargar la tendencia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(gran);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gran]);

  const xLabels = data?.series.map(s => s.period) ?? [];
  const yValues = data?.series.map(s => s.total) ?? [];

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title="Gasto - Tendencia"
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
        {!err && (
          <Box sx={{ width: '100%', height: 350 }}>
            <LineChart
              xAxis={[{ scaleType: 'point', data: xLabels }]}
              series={[{ data: yValues }]}
              height={350}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
