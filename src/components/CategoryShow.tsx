import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { deleteCategory, getCategory, type Category } from '../services/categories';
import { useEffect, useState } from 'react';

export default function CategoryShow() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [item, setItem] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!categoryId) return;
      setLoading(true);
      try {
        const data = await getCategory(Number(categoryId));
        if (mounted) setItem(data);
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [categoryId]);

  const handleDelete = async () => {
    if (!categoryId) return;
    const ok = window.confirm('Delete this category? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteCategory(Number(categoryId));
      notifications.show('Category deleted', { severity: 'success' });
      // navigate back to list
      navigate('..');
    } catch (err: any) {
      notifications.show(err?.message ?? 'Failed to delete category', { severity: 'error' });
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Category #{categoryId}</Typography>
        <Button color="error" variant="outlined" onClick={handleDelete}>
          Delete
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : item ? (
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ bgcolor: item.color ?? 'transparent', minWidth: 96, py: 1, px: 1.5, borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 20 }}>{item.icon ?? '❔'}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{item.name}</Typography>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary">No details available.</Typography>
      )}
    </Box>
  );
}
