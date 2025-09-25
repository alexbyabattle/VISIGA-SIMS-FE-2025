import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import useResultService from "../../api/services/ResultsService";

const AlevelStudentResults = () => {
  const { classId, examId, studentId } = useParams();
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
    let studentName = "";
    let examinationType = "";
    let className = "";

    data.forEach((item, index) => {
      // Extract general info from the first record
      if (index === 0) {
        studentName = item.studentName;
        examinationType = item.examinationType;
        className = item.className;
      }

      const marks = parseFloat(item.marks) || 0;
      if (marks > 0) {
        subjects.push({
          subject: item.subjectName,
          marks: marks.toFixed(2),
        });
      }
    });

    const totalMarks = subjects.reduce(
      (sum, s) => sum + parseFloat(s.marks),
      0
    );
    const average = subjects.length
      ? (totalMarks / subjects.length).toFixed(2)
      : "0.00";

    return {
      studentName,
      examinationType,
      className,
      subjects,
      totalMarks: totalMarks.toFixed(2),
      gpa: average,
    };
  };

  const columns = [
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 150 },
    { field: "marks", headerName: "Marks", flex: 1, minWidth: 50 },
  ];

  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : studentResult ? (
        <>
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
                <Typography fontWeight="bold">Examination</Typography>
                <Typography>{studentResult.examinationType}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Class</Typography>
                <Typography>{studentResult.className}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Total Marks</Typography>
                <Typography>{studentResult.totalMarks}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Average</Typography>
                <Typography>{studentResult.gpa}</Typography>
              </Box>
            </Box>
          </Card>

          <Box height={400}>
            <DataGrid
              rows={studentResult.subjects.map((s, i) => ({ id: i, ...s }))}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableRowSelectionOnClick
            />
          </Box>
        </>
      ) : (
        <Typography textAlign="center" mt={4} color="text.secondary">
          No results found.
        </Typography>
      )}
    </Box>
  );
};

export default AlevelStudentResults;
