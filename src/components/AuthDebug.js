import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getUserFromCookies } from '../utils/Cookie-utils';

const AuthDebug = () => {
  const user = getUserFromCookies();
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const handleClearAuth = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', margin: 2, borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>Authentication Debug</Typography>
      <Typography variant="body2">User from cookies: {user ? JSON.stringify(user, null, 2) : 'null'}</Typography>
      <Typography variant="body2">Access Token: {token ? 'Present' : 'Missing'}</Typography>
      <Typography variant="body2">Refresh Token: {refreshToken ? 'Present' : 'Missing'}</Typography>
      <Button onClick={handleClearAuth} variant="contained" color="error" sx={{ mt: 1 }}>
        Clear Auth & Reload
      </Button>
    </Box>
  );
};

export default AuthDebug;
