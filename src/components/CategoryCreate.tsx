import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createCategory } from '../services/categories';
import useNotifications from '../hooks/useNotifications/useNotifications';

function randomIcon() {
  const icons = ['🔳', '🔳', '🔳', '🔳', '🔳', '🔳', '🔳', '🔳', '🔳', '🔳'];
  return icons[Math.floor(Math.random() * icons.length)];
}

function randomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}

export default function CategoryCreate() {
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(() => randomIcon());
  const [color, setColor] = useState(() => randomColor());

  const handleSave = async () => {
  const payload = { name, icon, color };
    try {
      const created = await createCategory(payload);
      notifications.show('Category created', { severity: 'success' });
      // navigate back and pass the created item so the list can update immediately
      navigate('..', { state: { created } });
    } catch (err) {
      notifications.show(`Failed to create category: ${(err as Error).message}`, { severity: 'error' });
    }
  };

  return (
    <Box p={3} maxWidth={600}>
      <Typography variant="h5" mb={2}>Create Category</Typography>
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Icon"
        margin="normal"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        helperText="Enter a short text to represent the category"
      />
      <TextField
        fullWidth
        type="color"
        label="Color"
        margin="normal"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Box mt={2} display="flex" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={() => navigate('..')}>Cancel</Button>
      </Box>
    </Box>
  );
}
