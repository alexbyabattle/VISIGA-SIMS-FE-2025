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

const AlevelStudentResultsMarks100 = () => {
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
    "LANGUAGE",
    "BIBLEKNOWLEDGE",
    "KISWAHILI",
    "CIVICS",
  ];

  // ---------- Grades ----------
  const getGrade = (marks) => {
    if (marks >= 75) return "A";
    if (marks >= 65) return "B";
    if (marks >= 55) return "C";
    if (marks >= 45) return "D";
    if (marks >= 35) return "E";
    return "F";
  };

  const getGradePoint = (grade) =>
    ({ A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 }[grade] || 0);

  const getDivisionLabel = (points) => {
    if (points >= 1 && points <= 9) return `Division I • ${points}`;
    if (points >= 10 && points <= 12) return `Division II • ${points}`;
    if (points >= 13 && points <= 21) return `Division III • ${points}`;
    if (points >= 22 && points <= 24) return `Division IV • ${points}`;
    return `Division 0 • ${points}`;
  };

  // ---------- Subject calculation ----------
  const calculateGeneralValue = (subject, parts) => {
    if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;
      const s3 = parseFloat(parts.find((p) => p.name.endsWith("3"))?.marks) || 0;
      let value = null;

      if (s1 && s2 && s3) value = ((s1 + s2 + s3) / 250) * 100;
      else if (s1 && s2) value = (s1 + s2) / 2;
      else if (s1 && s3) value = (s1 + s3) / 2;
      else if (s2 && s3) value = (s2 + s3) / 2;
      else value = s1 || s2 || s3 ? (s1 || s2 || s3) : null;

      return value !== null
        ? { value: parseFloat(value.toFixed(2)), grade: getGrade(value) }
        : null;
    }

    // Other core subjects
    if (
      ["MATHEMATICS", "ECONOMICS", "HISTORY", "GEOGRAPHY", "LANGUAGE"].includes(subject)
    ) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;
      let value = null;

      if (s1 && s2) value = (s1 + s2) / 2;
      else value = s1 || s2 ? (s1 || s2) : null;

      return value !== null
        ? { value: parseFloat(value.toFixed(2)), grade: getGrade(value) }
        : null;
    }

    // Single-part subjects
    if (parts.length === 1) {
      const marks = parseFloat(parts[0].marks) || 0;
      return marks > 0
        ? { value: parseFloat(marks.toFixed(2)), grade: getGrade(marks) }
        : null;
    }

    return null;
  };

  const groupSubjects = (subjects) => {
    const grouped = {};
    Object.entries(subjects).forEach(([subject, data]) => {
      const baseSubject = CORE_SUBJECTS.find((s) => subject.startsWith(s));
      if (baseSubject) {
        if (!grouped[baseSubject]) grouped[baseSubject] = [];
        grouped[baseSubject].push({ name: subject, ...data });
      } else {
        grouped[subject] = data;
      }
    });
    return grouped;
  };

  const determineDivision = (subjects) => {
    const points = subjects
      .filter((s) => CORE_SUBJECTS.includes(s.subject))
      .map((s) => getGradePoint(s.grade));
    const usePoints =
      points.length > 7 ? points.sort((a, b) => a - b).slice(0, 7) : points;
    return usePoints.reduce((a, b) => a + b, 0);
  };

  // ---------- Process student ----------
  const processStudent = (studentData, classInfo) => {
    const groupedSubjects = groupSubjects(studentData.subjects);
    const finalSubjects = {};

    Object.entries(groupedSubjects).forEach(([subject, data]) => {
      let finalResult;
      if (Array.isArray(data)) {
        finalResult = calculateGeneralValue(subject, data);
      } else {
        const marks = parseFloat(data.marks) || 0;
        finalResult =
          marks > 0 ? { value: parseFloat(marks.toFixed(2)), grade: getGrade(marks) } : null;
      }

      // ✅ Only include subjects with valid results
      if (finalResult && finalResult.value > 0) {
        finalSubjects[subject] = {
          parts: Array.isArray(data) ? data : [{ name: subject, ...data }],
          final: finalResult,
        };
      }
    });

    const totalMarks = parseFloat(
      Object.values(finalSubjects)
        .reduce((sum, s) => sum + (parseFloat(s.final?.value) || 0), 0)
        .toFixed(2)
    );
    const count = Object.values(finalSubjects).length;
    const average = count ? parseFloat((totalMarks / count).toFixed(2)) : 0;

    const divisionPoints = determineDivision(
      Object.entries(finalSubjects).map(([subject, val]) => ({
        subject,
        grade: val.final?.grade,
      }))
    );
    const division = getDivisionLabel(divisionPoints);

    return {
      id: studentData.id,
      studentName: studentData.studentName,
      studentNumber: studentData.studentNumber,
      position: studentData.position,
      combination: studentData.combination || "N/A",
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
      totalStudents: "",
    };

    data.forEach((item) => {
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
          combination: item.combination || "",
          subjects: {},
        };
      }
      studentMap[item.studentId].subjects[item.subjectName] = { marks: item.marks };
    });

    return {
      students: Object.values(studentMap),
      classInfo,
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
                <Typography variant="body1">{studentResult.studentName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  EXAMINATION
                </Typography>
                <Typography variant="body1">{studentResult.examinationType}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  CLASS
                </Typography>
                <Typography variant="body1">{studentResult.className}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  COMBINATION
                </Typography>
                <Typography variant="body1">{studentResult.combination}</Typography>
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
                      {Object.entries(studentResult.subjects)
                        .filter(([_, data]) => data.final?.value > 0)
                        .map(([subject, data], idx) => (
                          <TableRow key={idx}>
                            <TableCell>{subject}</TableCell>
                            <TableCell>{data.final?.value?.toFixed(2)}</TableCell>
                            <TableCell>{data.final?.grade}</TableCell>
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

export default AlevelStudentResultsMarks100;
