import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { listCategories, type Category } from '../services/categories';

export default function CategoryDetails() {
  const [items, setItems] = useState<Category[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCategories();
        if (mounted) setItems(data);
      } catch (err) {
        if (mounted) setError(err as Error);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (error) return <Typography color="error">{error.message}</Typography>;
  if (items === null) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Category details</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {items.map((it) => (
          <Paper key={it.id} sx={{ p: 2, width: { xs: '100%', sm: '48%', md: '30%' } }} elevation={1}>
            <Box display="flex" gap={2} alignItems="center">
              <Box sx={{ bgcolor: it.color ?? 'transparent', minWidth: 72, py: 0.5, px: 1.25 }}>
                <Typography sx={{ fontSize: 18 }}>{it.icon ?? '❔'}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{it.name}</Typography>
                <Typography variant="body2" color="text.secondary">ID: {it.id}</Typography>
                <Typography variant="body2" color="text.secondary">Color: {it.color ?? '—'}</Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
