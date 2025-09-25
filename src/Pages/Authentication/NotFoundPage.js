import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material/styles';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Dynamic colors based on theme mode
  const isDarkMode = theme.palette.mode === 'dark';
  const backgroundColor = isDarkMode ? '##11024f' : '#f5f5f5';
  const primaryColor = isDarkMode ? '#bb86fc' : theme.palette.primary.main;
  const textColor = isDarkMode ? '#e0e0e0' : '#333';

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      bgcolor={backgroundColor}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        <Typography 
          variant="h1" 
          fontWeight="bold" 
          color={primaryColor} 
          gutterBottom
        >
          404
        </Typography>
        <Typography 
          variant="h5" 
          color={textColor} 
          gutterBottom
        >
          Oops! Page not found.
        </Typography>
        <Typography 
          variant="body1" 
          color={textColor} 
          mb={4}
        >
          The page you are looking for does not exist.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGoBack}
        >
          Go Back Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
