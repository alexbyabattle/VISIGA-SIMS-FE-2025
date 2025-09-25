import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import useResultService from "../../api/services/ResultsService";

const StudentReportResults = () => {
  const { classId, termId, studentId } = useParams(); 
  const { getResultsByTermAndClass } = useResultService();

  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);

  const isSmallScreen = useMediaQuery("(max-width:600px)"); // ✅ detect small screens

  // Helper function to check if a subject has all zero values
  const hasAllZeroValues = (subjectDetails) => {
    return (
      (subjectDetails.exam10Average === 0 || subjectDetails.exam10Average === null) &&
      (subjectDetails.exam40Average === 0 || subjectDetails.exam40Average === null) &&
      (subjectDetails.exam50Marks === 0 || subjectDetails.exam50Marks === null) &&
      (subjectDetails.totalMarks === 0 || subjectDetails.totalMarks === null)
    );
  };

  // Filter out subjects with all zero values
  const getFilteredSubjects = () => {
    if (!studentResult?.subjects) return [];
    
    return Object.entries(studentResult.subjects).filter(([subject, details]) => 
      !hasAllZeroValues(details)
    );
  };

  // Helper function to format GPA with 1 decimal place
  const formatGPA = (gpa) => {
    if (gpa === null || gpa === undefined || gpa === '') return 'N/A';
    return parseFloat(gpa).toFixed(1);
  };

  useEffect(() => {
    if (!classId || !termId || !studentId) {
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      try {
        const response = await getResultsByTermAndClass(termId, classId);

        if (response?.data) {
          const studentData = response.data.find(
            (s) => s.studentId === studentId
          );
          setStudentResult(studentData || null);
          // Set total number of students in the class
          setTotalStudents(response.data.length);
        }
      } catch (e) {
        console.error("Error fetching student results:", e);
        setStudentResult(null);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [classId, termId, studentId]);

  // ✅ Define columns for large screen table
  const columns = [
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 100 },
    { field: "exam10Average", headerName: "Exercise(10)", flex: 1, minWidth: 50 },
    { field: "exam40Average", headerName: "Tests(40)", flex: 1, minWidth: 50 },
    { field: "exam50Marks", headerName: "Exam(50)", flex: 1, minWidth: 50 },
    { field: "totalMarks", headerName: "Total(100)", flex: 1, minWidth: 50 },
    { field: "grade", headerName: "Grade", flex: 1, minWidth: 50 },
  ];

  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : studentResult ? (
        <>
          {/* ✅ Header Card */}
          <Card sx={{ p: 2, borderLeft: "6px solid green", mb: 2 }}>
            <Typography variant="h6" color="green" fontWeight="bold">
              Provisional Results:
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography fontWeight="bold">Student Name</Typography>
                <Typography>{studentResult.studentName}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Class</Typography>
                <Typography>{studentResult.className}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Combination</Typography>
                <Typography>{studentResult.combination}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Total Marks</Typography>
                <Typography>{studentResult.totalMarks}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Average</Typography>
                <Typography>{studentResult.average}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">GPA</Typography>
                <Typography>{formatGPA(studentResult.gpa)}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Position</Typography>
                <Typography>
                  {studentResult.positionText} out of {totalStudents}
                </Typography>
              </Box>
            </Box>
          </Card>

          {/* ✅ Responsive Results */}
          {isSmallScreen ? (
            // 📱 Small screen: stacked cards
            <Box display="flex" flexDirection="column" gap={2}>
              {getFilteredSubjects().map(([subject, details], idx) => (
                <Card key={idx} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {subject}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography>Exam10 Avg: {details.exam10Average}</Typography>
                  <Typography>Exam40 Avg: {details.exam40Average}</Typography>
                  <Typography>Exam50 Marks: {details.exam50Marks}</Typography>
                  <Typography>Total: {details.totalMarks}</Typography>
                  <Typography>Grade: {details.grade}</Typography>
                </Card>
              ))}
            </Box>
          ) : (
            // 💻 Large screen: DataGrid table
            <Box height={400}>
              <DataGrid
                rows={getFilteredSubjects().map(
                  ([subject, details], idx) => ({
                    id: idx,
                    subject,
                    ...details,
                  })
                )}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableRowSelectionOnClick
                rowHeight={35}
                headerHeight={40}
              />
            </Box>
          )}
        </>
      ) : (
        <Typography textAlign="center" mt={4} color="text.secondary">
          No results found.
        </Typography>
      )}
    </Box>
  );
};

export default StudentReportResults;
