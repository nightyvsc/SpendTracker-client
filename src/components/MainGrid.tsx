
import * as React from 'react';
import Box from '@mui/material/Box';
import Copyright from '../internals/components/Copyright';

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}