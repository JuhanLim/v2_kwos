import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loding() {
  return (
    <Box
      sx={{
        position: 'fixed',  // Ensure it covers the entire viewport
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a slight background color to highlight the loading state
        zIndex: 9999, // Ensure it's on top of other content
      }}
    >
      <CircularProgress />
    </Box>
  );
}
