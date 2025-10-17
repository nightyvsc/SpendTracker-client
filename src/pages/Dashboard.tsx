import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/AppNavbar';
import Header from '../components/Header';
import MainGrid from '../components/MainGrid';
import SideMenu from '../components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';
import { Outlet } from 'react-router-dom';

// 👇 Tu widget de tendencia (Recharts)
import TrendWidget from '../components/TrendWidget';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  
  const [summary, setSummary] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, categoryRes] = await Promise.all([
          api.get('/api/reports/summary/'),
          api.get('/api/reports/by-category/'),
        ]);
        setSummary(summaryRes.data);
        setCategories(categoryRes.data.by_category);
      } catch (err) {
        console.error('Error cargando datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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
            <MainGrid />

            {/* NUEVA SECCIÓN DE GRÁFICAS */}
            {!loading && summary && (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mt: 4 }}>
                {/* Gráfico de resumen mensual */}
                <Card sx={{ width: 400, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Gastos mensuales
                    </Typography>
                    <BarChart
                      xAxis={[{ data: summary.monthly.map((m: any) => m.month) }]}
                      series={[{ data: summary.monthly.map((m: any) => m.total) }]}
                      width={360}
                      height={250}
                    />
                  </CardContent>
                </Card>

                {/* Gráfico por categoría */}
                <Card sx={{ width: 400, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Gastos por categoría
                    </Typography>
                    <PieChart
                      series={[
                        {
                          data: categories.map((c) => ({
                            id: c.category,
                            value: c.total,
                            label: `${c.category} (${c.pct}%)`,
                          })),
                        },
                      ]}
                      width={360}
                      height={250}
                    />
                  </CardContent>
                </Card>
              </Stack>
            )}
            {/* 👇 Aquí va tu gráfica de tendencia en el dashboard principal */}
            <TrendWidget />

            {/* 👇 Si en el futuro anidas subrutas del dashboard, se renderizan aquí */}
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
