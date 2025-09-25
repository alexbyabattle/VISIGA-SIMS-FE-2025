import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";

const AlevelClassResultsMarks100 = () => {
  const location = useLocation();
  const classId = location.state?.classId || location.state?.id;
  const examinationTypeId = location.state?.examId;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { fetchClassResults, sendSmsToParents } = useResultService();

  const [results, setResults] = useState(null);
  const [groupedResults, setGroupedResults] = useState([]);
  const [sendingStatus, setSendingStatus] = useState({});
  const [sentStatus, setSentStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  // ---------- Fetch Results ----------
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      try {
        const data = await fetchClassResults(classId, examinationTypeId);
        setResults(data);
      } catch (e) {
        console.error("Error fetching results:", e);
        setResults({ data: [] });
      } finally {
        setIsLoading(false);
      }
    };
    if (classId && examinationTypeId) loadResults();
  }, [classId, examinationTypeId]);

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
    if (points >= 1 && points <= 9) return `Division 1 .${points}`;
    if (points >= 10 && points <= 12) return `Division 2 .${points}`;
    if (points >= 13 && points <= 21) return `Division 3 .${points}`;
    if (points >= 22 && points <= 24) return `Division 4 .${points}`;
    return `Division 0 .${points}`;
  };

  // ---------- Subject helpers ----------
  const calculateGeneralValue = (subject, parts) => {
    if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;
      const s3 = parseFloat(parts.find((p) => p.name.endsWith("3"))?.marks) || 0;
      let value = null;
      if (s1 && s2 && s3) value = (((s1 + s2 + s3) / 250) * 100).toFixed(2);
      else if (s1 && s2) value = ((s1 + s2) / 2).toFixed(2);
      else if (s1 && s3) value = (((s1 + s3) / 150) * 100).toFixed(2);
      else if (s2 && s3) value = (((s2 + s3) / 150) * 100).toFixed(2);
      else value = s1 || s2 || s3 ? (s1 || s2 || s3).toFixed(2) : null;
      return value ? { value, grade: getGrade(parseFloat(value)) } : null;
    }
    if (["MATHEMATICS", "ECONOMICS", "HISTORY", "GEOGRAPHY", "LANGUAGE"].includes(subject)) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;
      let value = null;
      if (s1 && s2) value = ((s1 + s2) / 2).toFixed(2);
      else value = s1 || s2 ? (s1 || s2).toFixed(2) : null;
      return value ? { value, grade: getGrade(parseFloat(value)) } : null;
    }
    return null;
  };

  const groupSubjects = (subjects) => {
    const grouped = {};
    Object.entries(subjects).forEach(([subject, data]) => {
      const base = CORE_SUBJECTS.find((s) => subject === s);
      if (base) grouped[subject] = data;
      else {
        const baseSubject = CORE_SUBJECTS.find((s) => subject.startsWith(s));
        if (baseSubject) {
          if (!grouped[baseSubject]) grouped[baseSubject] = [];
          grouped[baseSubject].push({ name: subject, ...data });
        } else grouped[subject] = data;
      }
    });
    return grouped;
  };

  const determineDivision = (subjects) => {
    const points = subjects
      .filter((s) => CORE_SUBJECTS.includes(s.subject))
      .map((s) => getGradePoint(s.grade));
    const usePoints = points.length > 7 ? points.sort((a, b) => a - b).slice(0, 7) : points;
    return usePoints.reduce((a, b) => a + b, 0);
  };

  // ---------- Process Students ----------
  const processStudent = (st) => {
    const grouped = groupSubjects(st.subjects);
    const finalSubjects = {};
    Object.entries(grouped).forEach(([sub, data]) => {
      if (Array.isArray(data)) {
        const res = calculateGeneralValue(sub, data);
        if (res) finalSubjects[sub] = { parts: data, final: res };
      } else {
        const marks = parseFloat(data.marks) || 0;
        const grade = data.grade || getGrade(marks);
        finalSubjects[sub] = {
          parts: [{ name: sub, marks, grade }],
          final: { value: marks, grade },
        };
      }
    });
    const total = Object.values(finalSubjects).reduce((sum, s) => sum + (parseFloat(s.final.value) || 0), 0);
    const count = Object.values(finalSubjects).filter((s) => s.final.value > 0).length;
    const avg = count ? total / count : 0;
    const divisionPts = determineDivision(
      Object.entries(finalSubjects).map(([subject, val]) => ({ subject, grade: val.final.grade }))
    );
    return {
      id: st.id,
      studentName: st.studentName,
      studentNumber: st.studentNumber,
      position: st.position,
      totalMarks: total,
      average: parseFloat(avg.toFixed(2)),
      division: getDivisionLabel(divisionPts),
      subjects: finalSubjects,
    };
  };

  // ---------- Group raw results ----------
  const groupResultsByStudent = (data) => {
    const map = {};
    data.forEach((item) => {
      if (!map[item.studentId])
        map[item.studentId] = {
          id: item.studentId,
          studentName: item.studentName,
          studentNumber: item.studentNumber,
          position: item.position,
          subjects: {},
        };
      map[item.studentId].subjects[item.subjectName] = {
        marks: item.marks,
        grade: item.grade,
      };
    });
    return Object.values(map);
  };

  // ---------- Handle data after fetch ----------
  useEffect(() => {
    if (!results?.data) return;
    const grouped = groupResultsByStudent(results.data);
    const processed = grouped.map(processStudent);
    const valid = processed.filter((st) =>
      Object.values(st.subjects).some((s) => s.final?.value > 0)
    );
    const sorted = valid
      .sort((a, b) => b.average - a.average)
      .map((s, i) => ({ ...s, position: i + 1 }));
    setGroupedResults(sorted);
  }, [results]);

  // ---------- SMS ----------
  const handleSendSMS = async (row) => {
    const id = row.id;
    setSendingStatus((p) => ({ ...p, [id]: true }));
    try {
      const subjectsSummary = Object.fromEntries(
        Object.entries(row.subjects).map(([sub, det]) => [
          sub,
          { marks: parseFloat(det.final.value) || 0, grade: det.final.grade },
        ])
      );
      await sendSmsToParents(id, {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: row.totalMarks,
        average: row.average,
        division: row.division,
        position: row.position,
        positionText: `${row.position} out of ${groupedResults.length}`,
      });
      setSentStatus((p) => ({ ...p, [id]: true }));
    } catch (e) {
      console.error("Error sending SMS", e);
    } finally {
      setSendingStatus((p) => ({ ...p, [id]: false }));
    }
  };

  // ---------- Columns ----------
  const createColumns = () => {
    if (!groupedResults.length) return [];
    const subjects = new Set();
    groupedResults.forEach((s) =>
      Object.keys(s.subjects).forEach((sub) => subjects.add(sub))
    );
    const cols = [
      {
        field: "studentName",
        headerName: "Name",
        flex: 1,
        renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentName}</Typography>,
      },
      {
        field: "studentNumber",
        headerName: "Index Number",
        flex: 1,
        renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentNumber}</Typography>,
      },
    ];

    subjects.forEach((sub) =>
      cols.push({
        field: `sub_${sub}`,
        headerName: sub,
        flex: 1,
        renderCell: ({ row }) => {
          const s = row.subjects[sub];
          if (!s) return null;

          // ✅ Skip if no marks
          const hasMarks =
            s.parts?.some((p) => parseFloat(p.marks) > 0) ||
            (s.final && parseFloat(s.final.value) > 0);

          if (!hasMarks) return null;

          return (
            <Box>
              {s.parts
                .filter((p) => parseFloat(p.marks) > 0)
                .map((p, idx) => (
                  <Typography key={idx} variant="body2">
                    {p.name}: {p.marks}
                    {p.grade && ` (${p.grade})`}
                  </Typography>
                ))}

              {s.final && parseFloat(s.final.value) > 0 && (
                <Box mt={1} borderTop="1px solid #ccc" pt={1}>
                  <Typography fontWeight="bold">
                    Total: {s.final.value} - {s.final.grade}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        },
      })
    );

    cols.push(
      { field: "totalMarks", headerName: "Total", flex: 0.7, renderCell: ({ row }) => row.totalMarks },
      { field: "average", headerName: "Average", flex: 0.5, renderCell: ({ row }) => row.average },
      { field: "division", headerName: "Division", flex: 0.7, renderCell: ({ row }) => row.division },
      {
        field: "position",
        headerName: "Position",
        flex: 0.5,
        renderCell: ({ row }) => `${row.position} out of ${groupedResults.length}`,
      },
      {
        field: "action",
        headerName: "Action",
        flex: 0.8,
        renderCell: ({ row }) => (
          <Button
            variant="contained"
            size="small"
            color={sentStatus[row.id] ? "success" : "secondary"}
            disabled={sendingStatus[row.id] || sentStatus[row.id]}
            onClick={() => handleSendSMS(row)}
          >
            {sendingStatus[row.id] ? "Sending..." : sentStatus[row.id] ? "Sent" : "Send SMS"}
          </Button>
        ),
      }
    );
    return cols;
  };

  // ---------- Render ----------
  return (
    <Box m="20px">
      <Header title="CLASS RESULTS" />
      {isLoading ? (
        <LoadingSpinner />
      ) : groupedResults.length ? (
        <Box sx={{ height: "75vh" }}>
          <DataGrid
            rows={groupedResults}
            columns={createColumns()}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            getRowHeight={() => 120}
          />
        </Box>
      ) : (
        <Typography textAlign="center" mt={4}>
          No results found
        </Typography>
      )}
    </Box>
  );
};

export default AlevelClassResultsMarks100;
