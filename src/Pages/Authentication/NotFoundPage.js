import React from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Dynamic colors based on theme mode
  const isDarkMode = theme.palette.mode === 'dark';
  const backgroundColor = isDarkMode ? '#11024f' : '#f5f5f5';
  const primaryColor = isDarkMode ? '#bb86fc' : theme.palette.primary.main;
  const textColor = isDarkMode ? '#e0e0e0' : '#333';

  const handleGoBack = () => {
    navigate('/');
  };

  const handleGoBackToPrevious = () => {
    navigate(-1); // Go back to previous page in browser history
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor={backgroundColor}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
        {/* Back Arrow Button */}
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <IconButton
            onClick={handleGoBackToPrevious}
            sx={{
              backgroundColor: primaryColor,
              color: 'white',
              '&:hover': {
                backgroundColor: isDarkMode ? '#9c7ce0' : theme.palette.primary.dark,
              },
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

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
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleGoBackToPrevious}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              '&:hover': {
                borderColor: isDarkMode ? '#9c7ce0' : theme.palette.primary.dark,
                backgroundColor: isDarkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              }
            }}
          >
            Go Back
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGoBack}
            sx={{
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: isDarkMode ? '#9c7ce0' : theme.palette.primary.dark,
              }
            }}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
