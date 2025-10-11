import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ExportPDFButton from "../../components/ExportPDFButton";

const ClassResultsMarks100 = () => {
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
    const savedSentStatus = localStorage.getItem(`sentStatus_${classId}_${examinationTypeId}`);
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
    "BIBLEKNOWLEGDE",
    "CIVICS",
    "KISWAHILI",
  ];

  // ---------- Helpers ----------
  const getGradeFromMarks = (marks) => {
    if (marks >= 75) return "A";
    if (marks >= 65) return "B";
    if (marks >= 45) return "C";
    if (marks >= 30) return "D";
    return "E";
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
      default:
        return 0;
    }
  };

  const determineDivisionPoints = (subjects) => {
    const points = Object.values(subjects).map((s) => getGradePoint(s.grade));
    const bestSeven = points.sort((a, b) => a - b).slice(0, 7);
    return bestSeven.reduce((sum, p) => sum + p, 0);
  };

  const getDivisionLabel = (points) => {
    if (points >= 1 && points <= 17) return `Division 1 • ${points}`;
    if (points <= 20) return `Division 2 • ${points}`;
    if (points <= 24) return `Division 3 • ${points}`;
    if (points <= 29) return `Division 4 • ${points}`;
    return `Division 0 • ${points}`;
  };

  // ---------- Fetch / restore ----------
  useEffect(() => {
    const saved = localStorage.getItem("classResultsMarks100");
    if (saved) {
      setGroupedResults(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!classId || !examinationTypeId) return;
      setIsLoading(true);
      try {
        const data = await fetchClassResults(classId, examinationTypeId);
        console.log("Fetched results data:", data); // Debug log
        setResults(data);
      } catch (e) {
        console.error("Error loading results:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (!groupedResults.length) {
      loadResults();
    }
  }, [classId, examinationTypeId]);

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

  const processStudent = (studentData) => {
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
        const roundedValue = parseFloat(value.toFixed(1));
        finalSubjects[subject] = {
          parts: Array.isArray(data) ? data : [{ name: subject, ...data }],
          final: { value: roundedValue },
          grade: getGradeFromMarks(roundedValue),
        };
      }
    });

    const totalMarks = parseFloat(
      Object.values(finalSubjects)
        .reduce((sum, sub) => sum + (parseFloat(sub.final?.value) || 0), 0)
        .toFixed(1)
    );

    const average = Object.keys(finalSubjects).length
      ? parseFloat((totalMarks / Object.keys(finalSubjects).length).toFixed(1))
      : 0;

    const points = determineDivisionPoints(finalSubjects);
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
    };
  };

  const groupResultsByStudent = (data) => {
    const studentMap = {};
    data.forEach((item) => {
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
    return Object.values(studentMap);
  };

  useEffect(() => {
    if (results && results.data && Array.isArray(results.data)) {
      const grouped = groupResultsByStudent(results.data);
      const processed = grouped
        .map((student) => processStudent(student))
        .filter((student) =>
          Object.values(student.subjects || {}).some(
            (s) => s?.final?.value && s.final.value > 0
          )
        )
        .sort((a, b) => b.average - a.average); // ⬅️ Sort highest average first

      // Extract class and examination info from the first result if available
      const firstResult = results.data?.[0];
      const className = results.className || firstResult?.className || "N/A";
      const examinationType = results.examinationType || firstResult?.examinationType || "N/A";
      
      const processedWithDetails = processed.map(student => ({
        ...student,
        className: className,
        examinationType: examinationType
      }));

      setGroupedResults(processedWithDetails);
      localStorage.setItem("classResultsMarks100", JSON.stringify(processedWithDetails));
    }
  }, [results]);

  // ---------- SMS ----------
  const handleSendSMS = async (row) => {
    const studentId = row.id;
    setSendingStatus((prev) => ({ ...prev, [studentId]: true }));
    try {
      const subjectsSummary = Object.fromEntries(
        Object.entries(row.subjects).map(([subject, details]) => [
          subject,
          {
            marks: details.final?.value || 0,
            grade: details.grade,
          },
        ])
      );

      const payload = {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: row.totalMarks,
        average: row.average,
        division: row.division,
        position: row.position,
      };

      await sendSmsToParents(studentId, payload);
      setSentStatus((prev) => {
        const newStatus = { ...prev, [studentId]: true };
        // Save to localStorage
        localStorage.setItem(`sentStatus_${classId}_${examinationTypeId}`, JSON.stringify(newStatus));
        return newStatus;
      });
    } catch (err) {
      console.error("❌ Error sending SMS", err);
    } finally {
      setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // ---------- Columns ----------
  const createColumns = () => {
    if (!groupedResults.length) return [];

    const subjectSet = new Set();
    groupedResults.forEach((student) =>
      Object.keys(student.subjects || {}).forEach((s) => subjectSet.add(s))
    );

    const columns = [
      {
        field: "studentName",
        headerName: "Name",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">{row.studentName}</Typography>
        ),
      },
      {
        field: "studentNumber",
        headerName: "Index Number",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">{row.studentNumber}</Typography>
        ),
      },
    ];

    Array.from(subjectSet).forEach((subject) => {
      columns.push({
        field: `subject_${subject}`,
        headerName: subject,
        flex: 1,
        minWidth: 220,
        renderCell: ({ row }) => {
          const subj = row.subjects[subject];
          if (!subj) return null;
          return (
            <Box>
              <Typography>Marks: {subj.final?.value?.toFixed(1) ?? "-"}</Typography>
              <Typography>Grade: {subj.grade ?? "-"}</Typography>
            </Box>
          );
        },
      });
    });

    columns.push(
      {
        field: "totalMarks",
        headerName: "Total Marks",
        flex: 0.7,
        minWidth: 100,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">{row.totalMarks.toFixed(1)}</Typography>
        ),
      },
      {
        field: "average",
        headerName: "Average",
        flex: 0.5,
        minWidth: 100,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">{row.average.toFixed(1)}</Typography>
        ),
      },
      {
        field: "division",
        headerName: "Division",
        flex: 0.6,
        minWidth: 120,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">{row.division}</Typography>
        ),
      },
      {
        field: "position",
        headerName: "Position",
        flex: 0.5,
        minWidth: 120,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">
            {row.position} out of {groupedResults.length}
          </Typography>
        ),
      },
      {
        field: "action",
        headerName: "Action",
        flex: 0.7,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              size="small"
              disabled={sendingStatus[row.id]}
              onClick={() => handleSendSMS(row)}
              sx={{
                backgroundColor: sentStatus[row.id] ? "#09792aff" : undefined,
                color: sentStatus[row.id] ? "white" : undefined,
                "&:hover": {
                  backgroundColor: sentStatus[row.id] ? "#304e3aff" : undefined,
                },
                "&:disabled": {
                  backgroundColor: sendingStatus[row.id] ? "#f3f0f0ff" : undefined,
                }
              }}
            >
              {sendingStatus[row.id]
                ? "Sending..."
                : sentStatus[row.id]
                ? "Sent"
                : "Send SMS"}
            </Button>
          </Box>
        ),
      }
    );

    return columns;
  };

  return (
    <Box m="20px">
      <Box p={2} ml={2} mr={2}>
        <Header
          title={`CLASS RESULTS FOR CLASS NAME: ${groupedResults[0]?.className || "N/A"} | EXAM-NAME: ${groupedResults[0]?.examinationType || "N/A"}`}
        />
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
        ) : groupedResults.length > 0 ? (
          <Box
            sx={{
              height: "75vh",
              "& .MuiDataGrid-root": { border: "none" },
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordWrap: "break-word",
                lineHeight: "1.4rem",
              },
            }}
          >
            <DataGrid
              rows={groupedResults}
              columns={createColumns()}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              getRowHeight={() => 120}
            />
          </Box>
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            textAlign="center"
            mt={4}
          >
            No results found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ClassResultsMarks100;
