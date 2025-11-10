import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { useTheme } from '@mui/material/styles';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import { Outlet } from 'react-router-dom';

// --- Datos / estado / API ---
import { useEffect, useState } from 'react';
import api from '../services/api';

// --- UI Recharts (Summary + ByCategory) ---
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, Typography, LinearProgress, Alert } from '@mui/material';

// --- Tu widget de Tendencia (Recharts) ---
import TrendWidget from '../components/TrendWidget';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

type MonthlyPoint = { month: string; total: number };
type CategoryPoint = { category: string; total: number; pct: number };
type SummaryResp = { monthly: MonthlyPoint[]; /* daily?: ... */ };

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [summary, setSummary] = useState<SummaryResp | null>(null);
  const [categories, setCategories] = useState<CategoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const theme = useTheme();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr(null);
        const [summaryRes, categoryRes] = await Promise.all([
          api.get('/api/reports/summary/'),
          api.get('/api/reports/by-category/'),
        ]);
        if (!mounted) return;
        setSummary(summaryRes.data ?? { monthly: [] });
        setCategories(categoryRes.data?.by_category ?? []);
      } catch (e) {
        if (!mounted) return;
        setErr('No se pudieron cargar los datos del dashboard.');
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            {/* Estado de carga / error */}
            {loading && (
              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress />
              </Box>
            )}
            {err && (
              <Box sx={{ width: '100%' }}>
                <Alert severity="error">{err}</Alert>
              </Box>
            )}

            {/* Bloque: Summary (mensual) + ByCategory */}
            {!loading && !err && summary && (
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={4}
                sx={{ mt: 2, width: '100%' }}
              >
                {/* Resumen mensual */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                  Gastos mensuales
                </Typography>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={summary.monthly ?? []}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme.palette.divider}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fill: theme.palette.mode === 'dark' ? '#E0E0E0' : '#333333',
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: theme.palette.mode === 'dark' ? '#E0E0E0' : '#333333',
                          fontSize: 12,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: theme.palette.background.paper,
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: theme.palette.mode === 'dark' ? '#F5F5F5' : '#222222',
                          borderRadius: 6,
                          boxShadow: '0 0 6px rgba(0,0,0,0.2)',
                        }}
                        labelStyle={{
                          color: theme.palette.mode === 'dark' ? '#F5F5F5' : '#111111',
                          fontWeight: 600,
                        }}
                        itemStyle={{
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          color: theme.palette.mode === 'dark' ? '#F5F5F5' : '#222222',
                          fontSize: 13,
                        }}
                      />
                      <Bar
                        dataKey="total"
                        name="Total"
                        fill={theme.palette.primary.main}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                  </CardContent>
                </Card>

                {/* Por categoría */}
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Gastos por categoría
                    </Typography>
                    <div style={{ width: '100%', height: 280 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={categories}
                            dataKey="total"
                            nameKey="category"
                            outerRadius={100}
                            label={({ name, payload }: { name?: string; payload?: any }) =>
                              `${name ?? payload?.category ?? ''} (${payload?.pct ?? 0}%)`
                            }
                          >
                            {categories.map((_, i) => (
                              <Cell
                                key={i}
                                fill={`hsl(${(i * 60) % 360}, 70%, 60%)`}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {/* Tendencia (tu widget) */}
            <TrendWidget />

            {/* Subrutas (si las agregan a futuro) */}
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
