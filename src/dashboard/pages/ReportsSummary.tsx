import { Box, Typography } from '@mui/material';

export default function ReportsSummary() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reports · Summary
      </Typography>
      <Typography variant="body1">
        Placeholder de Summary. Aquí conectaremos /api/reports/summary.
      </Typography>
    </Box>
  );
}
