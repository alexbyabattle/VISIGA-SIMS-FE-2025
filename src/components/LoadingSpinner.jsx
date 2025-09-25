// src/components/LoadingSpinner.js
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';


const LoadingSpinner = ({ message = "Loading...", height = "200px", size = 40 }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height={height}
      width="100%"
    >
      <CircularProgress size={size} />
      <Typography mt={2} color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
