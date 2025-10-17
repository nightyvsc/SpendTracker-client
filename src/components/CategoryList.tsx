import { Box, Typography, Button, List, ListItem, CircularProgress, IconButton, ListItemButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listCategories, deleteCategory, type Category } from '../services/categories';
import useNotifications from '../hooks/useNotifications/useNotifications';

export default function CategoryList() {
  const location = useLocation();
  const [items, setItems] = useState<Category[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const notifications = useNotifications();

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

  // If navigation brought a created item, prepend it to the list
  useEffect(() => {
    const state: any = location.state as any;
    if (state?.created) {
      setItems((prev) => (prev ? [state.created, ...prev] : [state.created]));
      // clear the state so that refreshes won't duplicate the item
      try {
        history.replaceState(null, '', location.pathname + location.search);
      } catch (_) {}
    }
  }, [location]);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Categories</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={RouterLink} to="new" variant="contained" color="primary">
            New Category
          </Button>
          <Button component={RouterLink} to="details" variant="outlined">Details</Button>
        </Box>
      </Box>

      {error ? (
        <Typography color="error">{error.message}</Typography>
      ) : items === null ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No categories yet.</Typography>
      ) : (
        <List>
          {items.map((it) => (
            <ListItem key={it.id}>
              <ListItemButton sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: it.color ?? 'transparent', minWidth: 72, py: 0.5, px: 1.25, borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 18, lineHeight: 1 }}>{it.icon ?? '❔'}</Typography>
                </Box>
                <Box sx={{ flex: 1, ml: 2, mr: 1 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'normal' }}>
                    {it.name}
                  </Typography>
                </Box>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const ok = window.confirm('Delete this category?');
                    if (!ok) return;
                    try {
                      await deleteCategory(it.id);
                      setItems((prev) => (prev ? prev.filter((p) => p.id !== it.id) : prev));
                      notifications.show('Category deleted', { severity: 'success' });
                    } catch (err: any) {
                      notifications.show(err?.message ?? 'Failed to delete category', { severity: 'error' });
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
