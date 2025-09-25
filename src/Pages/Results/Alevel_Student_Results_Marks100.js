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

const CORE_SUBJECTS = [
  "PHYSICS",
  "CHEMISTRY",
  "BIOLOGY",
  "MATHEMATICS",
  "ECONOMICS",
  "HISTORY",
  "GEOGRAPHY",
  "LANGUAGE",
];

const AlevelStudentResultsMark100 = () => {
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

  const getGrade = (value) => {
    if (value >= 75) return "A";
    if (value >= 65) return "B";
    if (value >= 50) return "C";
    if (value >= 40) return "D";
    if (value >= 30) return "E";
    return "F";
  };

  const getGradePoint = (grade) => {
    switch (grade) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      default:
        return 0;
    }
  };

  const getDivisionLabel = (points) => {
    if (points >= 1 && points <= 17) return `Division 1 . ${points}`;
    if (points >= 18 && points <= 20) return `Division 2 . ${points}`;
    if (points >= 21 && points <= 24) return `Division 3 . ${points}`;
    if (points >= 25 && points <= 29) return `Division 4 . ${points}`;
    return `Division 0 . ${points}`;
  };

  const groupResults = (data) => {
    const subjects = [];
    let studentName = "";
    let examinationType = "";
    let className = "";
    let position = "";
    let totalStudents = 0;

    data.forEach((item, index) => {
      // Extract general info from the first record
      if (index === 0) {
        studentName = item.studentName;
        examinationType = item.examinationType;
        className = item.className;
        position = item.position;
        totalStudents = item.totalStudents;
      }

      const marks = parseFloat(item.marks) || 0;
      const grade = item.grade || getGrade(marks);

      if (marks > 0) {
        subjects.push({
          subject: item.subjectName,
          marks: marks.toFixed(2),
          grade: grade,
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

    const divisionPoints = subjects
      .filter((s) => CORE_SUBJECTS.includes(s.subject))
      .reduce((sum, s) => sum + getGradePoint(s.grade), 0);

    const divisionLabel = getDivisionLabel(divisionPoints);

    return {
      studentName,
      examinationType,
      className,
      subjects,
      totalMarks: totalMarks.toFixed(2),
      gpa: average,
      divisionLabel,
      position: position ? `${position} out of ${totalStudents}` : "N/A",
    };
  };

  const columns = [
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 150 },
    { field: "marks", headerName: "Marks", flex: 1, minWidth: 50 },
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
                <Typography fontWeight="bold">Position</Typography>
                <Typography>{studentResult.position}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Total Marks</Typography>
                <Typography>{studentResult.totalMarks}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Average</Typography>
                <Typography>{studentResult.gpa}</Typography>
              </Box>
              <Box>
                <Typography fontWeight="bold">Division</Typography>
                <Typography>{studentResult.divisionLabel}</Typography>
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

export default AlevelStudentResultsMark100;
