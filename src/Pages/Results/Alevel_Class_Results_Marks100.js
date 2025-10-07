import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ExportPDFButton from "../../components/ExportPDFButton";

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

  // Load sent status from localStorage on component mount
  useEffect(() => {
    const savedSentStatus = localStorage.getItem(
      `sentStatus_${classId}_${examinationTypeId}`
    );
    if (savedSentStatus) {
      setSentStatus(JSON.parse(savedSentStatus));
    }
  }, [classId, examinationTypeId]);

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
    if (points >= 1 && points <= 9) return `Division 1 .${parseFloat(points).toFixed(1).replace(/\.0$/, '')}`;
    if (points >= 10 && points <= 12) return `Division 2 .${parseFloat(points).toFixed(1).replace(/\.0$/, '')}`;
    if (points >= 13 && points <= 21) return `Division 3 .${parseFloat(points).toFixed(1).replace(/\.0$/, '')}`;
    if (points >= 22 && points <= 24) return `Division 4 .${parseFloat(points).toFixed(1).replace(/\.0$/, '')}`;
    return `Division 0 .${parseFloat(points).toFixed(1).replace(/\.0$/, '')}`;
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
        finalSubjects[sub] = { parts: data, final: res };
      } else {
        const marks = parseFloat(data.marks) || 0;
        const grade = data.grade || getGrade(marks);
        finalSubjects[sub] = {
          parts: [{ name: sub, marks, grade }],
          final: { value: marks, grade },
        };
      }
    });
    const total = Object.values(finalSubjects).reduce((sum, s) => sum + (parseFloat(s.final?.value) || 0), 0);
    const count = Object.values(finalSubjects).filter((s) => s.final?.value > 0).length;
    const avg = count ? total / count : 0;
    const divisionPts = determineDivision(
      Object.entries(finalSubjects).map(([subject, val]) => ({ subject, grade: val.final?.grade }))
    );
    return {
      id: st.id,
      studentName: st.studentName,
      studentNumber: st.studentNumber,
      position: st.position,
      combination: st.combination || "N/A",
      totalMarks: parseFloat(total.toFixed(2)),
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
          combination: item.combination || "",
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
      Object.values(st.subjects).some((s) => 
        (s.final?.value > 0) || (s.parts && s.parts.length > 0)
      )
    );
    const sorted = valid
      .sort((a, b) => b.average - a.average)
      .map((s, i) => ({ ...s, position: i + 1 }));
    setGroupedResults(sorted);
  }, [results]);

  // ---------- Email ----------
  const handleSendEmail = async (row) => {
    const id = row.id;
    setSendingStatus((p) => ({ ...p, [id]: true }));
    try {
      const subjectsSummary = Object.fromEntries(
        Object.entries(row.subjects).map(([sub, det]) => [
          sub,
          { marks: parseFloat(det.final?.value) || 0, grade: det.final?.grade },
        ])
      );
      
      const emailData = {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: row.totalMarks,
        average: row.average,
        division: row.division,
        position: row.position,
        positionText: `${row.position} out of ${groupedResults.length}`,
      };

      // Send email instead of SMS
      await sendSmsToParents(id, emailData);
      
      // Update sent status and persist to localStorage
      setSentStatus((p) => {
        const newStatus = { ...p, [id]: true };
        localStorage.setItem(
          `sentStatus_${classId}_${examinationTypeId}`,
          JSON.stringify(newStatus)
        );
        return newStatus;
      });
    } catch (e) {
      console.error("Error sending email", e);
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
        minWidth: 170,
        renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentName}</Typography>,
      },
      {
        field: "studentNumber",
        headerName: "Index Number",
        flex: 1,
        renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentNumber}</Typography>,
      },
      {
        field: "combination",
        headerName: "Combination",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => <Typography fontWeight="bold">{row.combination}</Typography>,
      },
    ];

    subjects.forEach((sub) =>
      cols.push({
        field: `sub_${sub}`,
        headerName: sub,
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => {
          const s = row.subjects[sub];
          if (!s) return "";

          // Check if there are any marks to display
          const hasMarks =
            (s.parts && s.parts.some((p) => parseFloat(p.marks) > 0)) ||
            (s.final && parseFloat(s.final.value) > 0);

          if (!hasMarks) return "";

          return (
            <Box>
              {s.parts && s.parts
                .filter((p) => parseFloat(p.marks) > 0)
                .map((p, idx) => (
                  <Typography key={idx} variant="body2">
                    {p.name}: {parseFloat(p.marks).toFixed(2)}
                    {p.grade && ` (${p.grade})`}
                  </Typography>
                ))}

              {s.final && parseFloat(s.final.value) > 0 && (
                <Box mt={1} borderTop="1px solid #ccc" pt={1}>
                  <Typography fontWeight="bold">
                    Total: {parseFloat(s.final.value).toFixed(2)} - {s.final.grade}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        },
      })
    );

    cols.push(
      { field: "totalMarks", headerName: "Total", flex: 0.7, renderCell: ({ row }) => parseFloat(row.totalMarks).toFixed(2) },
      { field: "average", headerName: "Average", flex: 0.5,  renderCell: ({ row }) => parseFloat(row.average).toFixed(2) },
      { field: "division", headerName: "Division", flex: 0.7, minWidth: 120, renderCell: ({ row }) => row.division },
      {
        field: "position",
        headerName: "Position",
        flex: 0.5,
        minWidth: 120,
        renderCell: ({ row }) => `${row.position} out of ${groupedResults.length}`,
      },
      {
        field: "action",
        headerName: "Action",
        flex: 0.8,
        minWidth: 120,
        renderCell: ({ row }) => (
          <Button
            variant="contained"
            size="small"
            disabled={sendingStatus[row.id]}
            onClick={() => handleSendEmail(row)}
            sx={{
              backgroundColor: sentStatus[row.id] ? "#0A6927" : undefined,
              color: sentStatus[row.id] ? "white" : undefined,
              "&:hover": {
                backgroundColor: sentStatus[row.id] ? "#085A1F" : undefined,
              },
              "&:disabled": {
                backgroundColor: sendingStatus[row.id] ? "#ccc" : undefined,
              },
            }}
          >
            {sendingStatus[row.id]
              ? "Sending..."
              : sentStatus[row.id]
              ? "Sent"
              : "Send Email"}
          </Button>
        ),
      }
    );
    return cols;
  };

  // ---------- Render ----------
  return (
    <Box m="20px">
      <Box p={2} ml={2} mr={2}>
        <Header title="CLASS RESULTS" />
        <Box mb={2} display="flex" justifyContent="flex-end">
          <ExportPDFButton
            groupedResults={groupedResults}
            isClassResults={true}
            className={groupedResults[0]?.className || "N/A"}
            examinationType={groupedResults[0]?.examinationType || "N/A"}
          />
        </Box>

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
    </Box>
  );
};

export default AlevelClassResultsMarks100;
