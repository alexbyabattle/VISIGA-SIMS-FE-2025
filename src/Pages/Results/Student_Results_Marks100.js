import React, { useState, useEffect } from "react";
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
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";

const StudentResultsMarks100 = () => {
  const { classId, examId, studentId } = useParams();
  const theme = useTheme();
  const { fetchStudentResults } = useResultService();

  const [studentResult, setStudentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const CORE_SUBJECTS = [
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "MATHEMATICS",
    "ECONOMICS",
    "HISTORY",
    "GEOGRAPHY",
    "BIBLEKNOWLEGDE",
    "CIVICS",
    "KISWAHILI",
  ];

  // ---------- Helpers ----------
  const getNectaGrade = (marks) => {
    if (marks >= 75) return "A";
    if (marks >= 65) return "B";
    if (marks >= 55) return "C";
    if (marks >= 45) return "D";
    if (marks >= 35) return "E";
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
      case "S":
      case "F":
        return 6;
      default:
        return 0;
    }
  };

  const determineDivisionPoints = (subjects) => {
    const points = subjects.map((s) => getGradePoint(s.grade));
    const bestSeven = points.sort((a, b) => a - b).slice(0, 7);
    return bestSeven.reduce((sum, p) => sum + p, 0);
  };

  const getDivisionLabel = (points) => {
    if (points >= 1 && points <= 17) return `Division I • ${points}`;
    if (points <= 20) return `Division II • ${points}`;
    if (points <= 24) return `Division III • ${points}`;
    if (points <= 29) return `Division IV • ${points}`;
    return `Division 0 • ${points}`;
  };

  // ---------- Group & process ----------
  const calculateGeneralValue = (subject, parts) => {
    if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;
      if (s1 && s2) return { value: ((s1 + s2) / 150) * 100 };
      if (s1) return { value: s1 };
      if (s2) return { value: s2 };
      return null;
    }
    if (parts.length === 1) {
      const marks = parseFloat(parts[0].marks) || 0;
      return { value: marks };
    }
    return null;
  };

  const groupSubjects = (subjects) => {
    const grouped = {};
    Object.entries(subjects).forEach(([subject, data]) => {
      const base = CORE_SUBJECTS.find((s) => subject.startsWith(s));
      if (base) {
        if (!grouped[base]) grouped[base] = [];
        grouped[base].push({ name: subject, ...data });
      } else {
        grouped[subject] = data;
      }
    });
    return grouped;
  };

  const processStudent = (studentData, classInfo) => {
    const groupedSubjects = groupSubjects(studentData.subjects);
    const finalSubjects = {};

    Object.entries(groupedSubjects).forEach(([subject, data]) => {
      let value;
      if (Array.isArray(data)) {
        const res = calculateGeneralValue(subject, data);
        if (res) value = res.value;
      } else {
        value = parseFloat(data.marks) || 0;
      }

      if (value !== undefined) {
        const roundedValue = parseFloat(value.toFixed(2));
        finalSubjects[subject] = {
          parts: Array.isArray(data) ? data : [{ name: subject, ...data }],
          final: { value: roundedValue },
          grade: getNectaGrade(roundedValue),
        };
      }
    });

    const totalMarks = parseFloat(
      Object.values(finalSubjects)
        .reduce((sum, sub) => sum + (parseFloat(sub.final?.value) || 0), 0)
        .toFixed(2)
    );

    const average = Object.keys(finalSubjects).length
      ? parseFloat((totalMarks / Object.keys(finalSubjects).length).toFixed(2))
      : 0;

    const points = determineDivisionPoints(Object.values(finalSubjects).map(s => ({ grade: s.grade })));
    const division = getDivisionLabel(points);

    return {
      id: studentData.id,
      studentName: studentData.studentName,
      studentNumber: studentData.studentNumber,
      position: studentData.position,
      totalMarks,
      average,
      division,
      subjects: finalSubjects,
      className: classInfo?.className || "N/A",
      examinationType: classInfo?.examinationType || "N/A",
      totalStudents: classInfo?.totalStudents || "N/A",
    };
  };

  const groupResultsByStudent = (data) => {
    const studentMap = {};
    let classInfo = {
      className: "",
      examinationType: "",
      totalStudents: ""
    };

    data.forEach((item) => {
      // Extract class information from the first item
      if (!classInfo.className) {
        classInfo.className = item.className || "";
        classInfo.examinationType = item.examinationType || "";
        classInfo.totalStudents = item.totalStudents || "";
      }

      if (!studentMap[item.studentId]) {
        studentMap[item.studentId] = {
          id: item.studentId,
          studentName: item.studentName,
          studentNumber: item.studentNumber,
          position: item.position,
          subjects: {},
        };
      }
      studentMap[item.studentId].subjects[item.subjectName] = {
        marks: item.marks,
      };
    });
    
    return {
      students: Object.values(studentMap),
      classInfo: classInfo
    };
  };

  // ---------- Fetch ----------
  useEffect(() => {
    if (!classId || !examId || !studentId) {
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      try {
        const data = await fetchStudentResults(classId, examId, studentId);
        if (Array.isArray(data?.data) && data.data.length > 0) {
          const grouped = groupResultsByStudent(data.data);
          if (grouped.students.length > 0) {
            const processed = processStudent(grouped.students[0], grouped.classInfo);
            setStudentResult(processed);
          } else {
            setStudentResult({ subjects: [] });
          }
        } else {
          setStudentResult({ subjects: [] });
        }
      } catch (e) {
        console.error("❌ Error fetching student results:", e);
        setStudentResult({ subjects: [] });
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [classId, examId, studentId]);


  // ---------- Render ----------
  return (
    <Box m={2}>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : studentResult ? (
        <>
          <Card sx={{ p: 2, borderLeft: "6px solid green", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="green" gutterBottom>
              Provisional Results
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  STUDENT NAME
                </Typography>
                <Typography variant="body1">
                  {studentResult.studentName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  EXAMINATION
                </Typography>
                <Typography variant="body1">
                  {studentResult.examinationType}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  CLASS
                </Typography>
                <Typography variant="body1">
                  {studentResult.className}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Subject</strong></TableCell>
                    <TableCell><strong>Marks</strong></TableCell>
                    <TableCell><strong>Grade</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentResult.subjects && Object.keys(studentResult.subjects).length > 0 ? (
                    <>
                      {Object.entries(studentResult.subjects).map(([subject, data], idx) => (
                        <TableRow key={idx}>
                          <TableCell>{subject}</TableCell>
                          <TableCell>{data.final?.value?.toFixed(2) || "0.00"}</TableCell>
                          <TableCell>{data.grade || "F"}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell><strong>Total Marks</strong></TableCell>
                        <TableCell colSpan={2}><strong>{studentResult.totalMarks.toFixed(2)}</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Average</strong></TableCell>
                        <TableCell colSpan={2}><strong>{studentResult.average.toFixed(2)}</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Division</strong></TableCell>
                        <TableCell colSpan={2}><strong>{studentResult.division}</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Position</strong></TableCell>
                        <TableCell colSpan={2}><strong>{studentResult.position} out of {studentResult.totalStudents}</strong></TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
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

export default StudentResultsMarks100;
