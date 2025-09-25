import React from 'react';
import { Typography, Box, useTheme, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";


const Header = ({ title, subtitle, buttonText, navigateTo, buttonVariant = "none" , buttonVariant1 = "none" , buttonText1  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(navigateTo);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb="5px">
      <Box>
        <Typography
          variant="h4"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 2px 0" }}
        >
          {title}
        </Typography>
        <Typography variant="h5" color={colors.greenAccent[400]}>
          {subtitle}
        </Typography>
      </Box>
      <Box>
        <Box display="flex" justifyContent="space-between" gap={2}>
          <Button variant={buttonVariant} color="secondary" sx={{ mt: 2 }} onClick={handleNavigation}>
            {buttonText}
          </Button>    
        </Box>

      </Box>
    </Box>
  );
};

export default Header;
