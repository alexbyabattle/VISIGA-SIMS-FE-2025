import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useTermService from '../../api/services/termService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataGrid } from '@mui/x-data-grid';
import * as image from '../../assets';

const Class_Term_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // 🟢 Renamed to terms instead of examinations
  const [terms, setTerms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { GetTermsByClassId } = useTermService();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        const data = await GetTermsByClassId(id);
        const sortedData = (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTerms(sortedData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🟢 Handle navigation depending on class type
  const handleViewResults = (termId) => {
    navigate(`/term-class-results/${termId}`, {
      state: { termId, id },
    });
  };

  

  // 🟢 Columns now match Term DTO
  const columns = [
    {
      field: 'termName',
      headerName: 'Term Name',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const classType = terms[0]?.classType || "";

        const handleClick = () => {
            handleViewResults(params.row.id);
        };

        return (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleClick}
          >
            Results
          </Button>
         
        );
      },
    },
  ];

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>
      {/* Header Banner */}
      <Box
        height="auto"
        display="flex"
        justifyContent="space-between"
        border={`1px solid ${borderColor}`}
        mb={2}
        flexWrap="wrap"
      >
        {/* Left */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={1}
          justifyContent="center"
        >
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
            <Box
              component="img"
              src={image.visigalogo}
              alt="logo"
              sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
            />
            <Typography
              variant="h7"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              St Mary's Junior Seminary (VISIGA SEMINARY)
            </Typography>
          </Box>
        </Box>

        {/* Center */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
          p={2}
          textAlign="center"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.4rem' } }}
          >
            TERM DETAILS
          </Typography>
        </Box>

        {/* Right */}
        <Box
          flex={1}
          display="flex"
          alignItems="center"
          p={1}
          justifyContent="center"
        >
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
            <Box
              component="img"
              src={image.cathedral5}
              alt="arch"
              sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
            >
              Seminary under Archdiocese of Dar es Salaam
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <Typography variant="h4" align="start" gutterBottom>
          LIST OF TERMS FOR {terms[0]?.className || ""}
        </Typography>

        {isLoading ? (
          <LoadingSpinner message="Loading terms..." height="250px" />
        ) : terms.length > 0 ? (
          <Box sx={{ height: 500, width: '100%', mt: 2 }}>
            <DataGrid
              rows={terms}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={5}
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{
                '& .MuiDataGrid-cell:hover': {
                  cursor: 'default',
                },
              }}
            />
          </Box>
        ) : (
          <Typography>No terms available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Class_Term_Data;
