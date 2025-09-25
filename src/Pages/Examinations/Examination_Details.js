import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useExaminationService from '../../api/services/examinationService';
import Table from '../../components/Table';
import Header from "../../components/Header";
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataGrid } from '@mui/x-data-grid';
import * as image from '../../assets';

const Examination_Data = () => {
  const { id } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchExaminationTypesByClassId } = useExaminationService();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Early return if no id
      
      setIsLoading(true);
      try {
        const data = await fetchExaminationTypesByClassId(id);
        const sortedData = (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setExaminations(sortedData);
      } catch (error) {
        console.error("Failed to load examinations:", error);
        setExaminations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]); // Only depend on id, not the function

  const handleViewResults = (examId) => {
    navigate(`/class_results/${id}`, {
      state: { examId, classId: id },
    });
  };

  const handleViewResultsMarks100 = (examId) => {
    navigate(`/class_results_marks/${id}`, {
      state: { examId, classId: id },
    });
  };

  const handleViewAlevelResults = (examId) => {
    navigate(`/A-level_results/${id}`, {
      state: { examId, classId: id },
    });
  };  

  const handleViewAlevelResultsMarks100 = (examId) => {
    navigate(`/A-level_results_marks/${id}`, {
      state: { examId, classId: id },
    });
  };


  
  const columns = [
    {
      field: 'examinationName',
      headerName: 'Examination Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'examMarks',
      headerName: 'MARKS',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'status',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const classType = examinations[0]?.classType || "";
        const examMarks = params.row.examMarks || ""; 
        
        const handleClick = () => {
          if (classType === "O-LEVEL" && examMarks === "100") {
            handleViewResultsMarks100(params.row.id);
          } else if (classType === "O-LEVEL") {
            handleViewResults(params.row.id);
          } else if (classType === "A-LEVEL" && examMarks === "100") {
            handleViewAlevelResultsMarks100(params.row.id);
          } else if (classType === "A-LEVEL") {
            handleViewAlevelResults(params.row.id);
          }
        };

        return (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleClick}
          >
            View Results
          </Button>
        );
      },
    }

  ];

  return (
    <Box sx={{ ml: '20px', mr: '20px' }}>

      <Box
        height="auto"
        display="flex"
        justifyContent="space-between"
        border={`1px solid ${borderColor}`}
        mb={2}
        flexWrap="wrap"
      >

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
            EXAMINATION DETAILS
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
          LIST OF EXAMINATIONS FOR {examinations[0]?.className || ""}
        </Typography>

        {isLoading ? (
          <LoadingSpinner message="Loading examinations..." height="250px" />
        ) : examinations.length > 0 ? (
          <Box sx={{ height: 500, width: '100%', mt: 2 }}>
            <DataGrid
              rows={examinations}
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
          <Typography>No examination types available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Examination_Data;
