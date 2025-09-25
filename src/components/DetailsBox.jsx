import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";


const DetailsBox = ({ class_createdAt, class_status , subject_status, subject_createdAt, name1, name2, clazz, subject, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 20px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {name1}
          </Typography>
          {clazz && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {clazz}
            </Typography>
          )}
          {class_createdAt && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {class_createdAt}
            </Typography>
          )}
          {class_status && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {class_status}
            </Typography>
          )}

          <Box mt={1}> {icon} </Box>
        </Box>

        <Box>
          
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {name2}
          </Typography>
          {subject && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {subject}
            </Typography>
          )}
          {subject_createdAt && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {subject_createdAt}
            </Typography>
          )}
          {subject_status && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {subject_status}
            </Typography>
          )}
        </Box>
      </Box>
      
      
    </Box>
  );
};

export default DetailsBox;
