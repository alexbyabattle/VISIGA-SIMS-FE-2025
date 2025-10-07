import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useParams } from "react-router-dom";
import useResultService from '../../api/services/ResultsService';

const StudentResults = () => {
  const { classId, examId, studentId } = useParams();
  const theme = useTheme();

  const { fetchStudentResults } = useResultService();
  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId || !examId || !studentId) {
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      try {
        const data = await fetchStudentResults(classId, examId, studentId);

        if (Array.isArray(data?.data) && data.data.length > 0) {
          const studentData = groupResults(data.data);
          setStudentResult(studentData);
        } else {
          setStudentResult({ subjects: [] });
        }
      } catch (e) {
        console.error("Error fetching student results:", e);
        setStudentResult({ subjects: [] });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [classId, examId, studentId]);

  const groupResults = (data) => {
    const subjects = [];
    let studentName = "", examinationType = "", className = "", position = "", totalStudents = "", combination = "";

    data.forEach(item => {
      examinationType = item.examinationType || "";
      studentName = item.studentName || "";
      className = item.className || "";
      position = item.position || "";
      totalStudents = item.totalStudents || "";
      combination = item.combination || "";
      subjects.push({
        subject: item.subjectName || "Unknown Subject",
        code: item.subjectCode || "",
        credits: item.credits || 0,
        marks: parseFloat(item.marks) || 0,
        status: item.status || "PASS"
      });
    });

    const totalMarks = subjects.reduce((acc, sub) => acc + (parseFloat(sub.marks) || 0), 0);
    const average = subjects.length > 0 ? (totalMarks / subjects.length) : 0;

    const positionText = position && totalStudents ? `${position} out of ${totalStudents}` : position;

    return {
      studentName,
      className,
      examinationType,
      position: positionText,
      average: average.toFixed(2), // ✅ Ensure two decimal places
      status: "PASS",
      totalMarks,
      subjects,
      combination: combination || "N/A"
    };
  };

  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : studentResult ? (
        <>
          <Card sx={{ p: 1, borderLeft: "6px solid green", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
              Provisional Results:
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">STUDENT NAME</Typography>
                <Typography variant="body1">{studentResult.studentName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">EXAMINATION</Typography>
                <Typography variant="body1">{studentResult.examinationType}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">COMBINATION</Typography>
                <Typography variant="body1">{studentResult.combination}</Typography>
              </Box>
            </Box>
          </Card>

          <Box sx={{ overflowX: 'auto' }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Marks</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(studentResult.subjects) && studentResult.subjects.length > 0 ? (
                    <>
                      {studentResult.subjects.map((sub, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{sub.subject}</TableCell>
                          <TableCell>{sub.marks}</TableCell>
                        </TableRow>
                      ))}
                      {/* Total Marks Row */}
                      <TableRow>
                        <TableCell><strong>Total Marks</strong></TableCell>
                        <TableCell><strong>{studentResult.totalMarks}</strong></TableCell>
                      </TableRow>
                      {/* Average Marks Row */}
                      <TableRow>
                        <TableCell><strong>Average</strong></TableCell>
                        <TableCell><strong>{studentResult.average}</strong></TableCell>
                      </TableRow>
                      {/* Position Row */}
                      <TableRow>
                        <TableCell><strong>Position</strong></TableCell>
                        <TableCell><strong>{studentResult.position}</strong></TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No subjects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Typography variant="h6" textAlign="center" mt={4} color="text.secondary">
          No results found.
        </Typography>
      )}
    </Box>
  );
};

export default StudentResults;
