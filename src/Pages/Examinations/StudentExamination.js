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

const Student_Examination = () => {
  const { classId, studentId } = useParams();
  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [examinations, setExaminations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchExaminationTypesByClassId } = useExaminationService();


  useEffect(() => {
    const fetchData = async () => {
      if (classId) {
        setIsLoading(true);
        const data = await fetchExaminationTypesByClassId(classId);
        const sortedData = (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setExaminations(sortedData);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [classId]);


  const columns = [
    {
      field: 'examinationName',
      headerName: 'Examination Name',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'examMarks',
      headerName: 'MARKS',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const { classType, examMarks } = params.row;

        const handleClick = () => {
          if (classType === "O-LEVEL" && examMarks === "100") {
            navigate(`/student_results_marks/${studentId}/${classId}/${params.row.id}`);
          } else if (classType === "O-LEVEL") {
            navigate(`/student_results/${studentId}/${classId}/${params.row.id}`);
          } else if (classType === "A-LEVEL" && examMarks === "100") {
            navigate(`/alevel_student_results_marks/${studentId}/${classId}/${params.row.id}`);
          } else if (classType === "A-LEVEL") {
            navigate(`/alevel_student_results/${studentId}/${classId}/${params.row.id}`);
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
      {/* Header */}
      <Box
        height="auto"
        display="flex"
        flexDirection="row"
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
            LIST OF ALL EXAMINATIONS DONE BY YOUR SON
          </Typography>
        </Box>

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

      {/* Examination Table */}
      <Box>
        <Typography variant="h4" align="start" gutterBottom>
          LIST OF EXAMINATIONS
        </Typography>

        {isLoading ? (
          <LoadingSpinner message="Loading examinations..." height="200px" />
        ) : examinations.length > 0 ? (
          <Box sx={{ height: 5000, width: '100%', mt: 1 }}>
            <DataGrid
              rows={examinations.filter(exam => exam.status === "PUBLISHED")}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
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

export default Student_Examination;
