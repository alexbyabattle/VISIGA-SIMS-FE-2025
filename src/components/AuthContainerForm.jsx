import React from 'react';
import { Box, useTheme, Typography, Avatar } from "@mui/material";
import image from "../data/image";

const AuthFormContainer = ({ title, children, avatarSrc = image.visiga }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      bgcolor={isDarkMode ? '#0D1825' : '#ffffff'}
      p={4}
      borderRadius={5}
      mt={6}
      mx="auto"
      maxWidth={500}
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow={3}
    >
      <Typography
        component="h5"
        variant="h5"
        mb={1}
        color={isDarkMode ? 'white' : 'black'}
        textAlign="center"
      >
        ST MARY'S JUNIOR SEMINARY VISIGA
      </Typography>

      <Avatar sx={{ m: 2, bgcolor: 'secondary.main', width: 120, height: 120 }}>
        <img alt="visiga"   width="100%" height="100%" src={avatarSrc} style={{ borderRadius: '50%' }} />
      </Avatar>

      <Box mb={2} display="flex" justifyContent="center">
        <Typography component="h2" variant="h5">{title}</Typography>
      </Box>

      {children}
    </Box>
  );
};

export default AuthFormContainer;
