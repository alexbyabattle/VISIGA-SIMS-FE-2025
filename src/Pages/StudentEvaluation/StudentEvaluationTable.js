import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Avatar,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthDebug from '../../components/AuthDebug';
import useStudentEvaluationService from '../../api/services/StudentEvaluationService';

const StudentEvaluationTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getAllStudentEvaluations } = useStudentEvaluationService();

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllStudentEvaluations();
      setEvaluations(data || []);
    } catch (error) {
      console.error('Error loading student evaluations:', error);
      setError('Failed to load student evaluations');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (termId, studentId) => {
    navigate(`/student_evaluation_report/${termId}/${studentId}`);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return colors.greenAccent[500];
      case 'B':
        return colors.blueAccent[500];
      case 'F':
        return colors.redAccent[500];
      default:
        return colors.grey[500];
    }
  };

  const getGradeLabel = (grade) => {
    switch (grade) {
      case 'A':
        return 'Excellent';
      case 'B':
        return 'Good';
      case 'F':
        return 'Poor';
      default:
        return 'Not Rated';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student evaluations..." />;
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="STUDENT EVALUATIONS" subtitle="Student Evaluation Management" />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="STUDENT EVALUATIONS" subtitle="Student Evaluation Management" />
      <AuthDebug />
      
      <Box
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: '8px',
          padding: '20px',
          mt: 2
        }}
      >
        <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Student Name
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Term
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Spiritual Life
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Academic Life
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Manual Work
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Health
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Leadership
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Sports
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ color: colors.grey[100] }}>
                    <Typography variant="h6" sx={{ py: 4 }}>
                      No student evaluations found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ color: colors.grey[100] }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          alt={evaluation.studentName || 'Student'}
                          src={evaluation.studentPhotoUrl ? `${process.env.REACT_APP_API_URL || 'http://localhost:8086'}${evaluation.studentPhotoUrl}` : null}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {evaluation.studentName || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: colors.grey[100] }}>
                      {evaluation.termName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.spiritualLife || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.spiritualLife),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.academicLife || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.academicLife),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.manualWork || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.manualWork),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.health || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.health),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.leadershipSkills || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.leadershipSkills),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={evaluation.sports || 'N/A'}
                        sx={{
                          backgroundColor: getGradeColor(evaluation.sports),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleViewReport(evaluation.termId, evaluation.studentId)}
                        sx={{
                          backgroundColor: colors.blueAccent[500],
                          '&:hover': {
                            backgroundColor: colors.blueAccent[600],
                          }
                        }}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default StudentEvaluationTable;
