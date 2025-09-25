import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ExportPDFButton from "../../components/ExportPDFButton";

const ClassResults = () => {
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

  // Core subject list
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

  // ---------- Fetch / restore results ----------
  useEffect(() => {
    const loadResults = async () => {
      if (!classId || !examinationTypeId) {
        console.log("Missing classId or examinationTypeId:", {
          classId,
          examinationTypeId,
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Loading results for classId:", classId, "examinationTypeId:", examinationTypeId);
        const data = await fetchClassResults(classId, examinationTypeId);
        console.log("Fetched results data:", data);
        setResults(data);
      } catch (e) {
        console.error("Error loading results:", e);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadResults();
  }, [classId, examinationTypeId]);

  // ---------- Helpers ----------
  const calculateGeneralValue = (subject, parts) => {
    if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
      const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
      const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;

      let value = null;
      if (s1 && s2) {
        value = ((s1 + s2) / 150) * 100;
      } else if (s1) {
        value = s1;
      } else if (s2) {
        value = s2;
      }

      return value !== null ? { value } : null;
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
      if (Array.isArray(data)) {
        const result = calculateGeneralValue(subject, data);
        if (result) {
          finalSubjects[subject] = { parts: data, final: result };
        }
      } else {
        const value = parseFloat(data.marks) || 0;
        finalSubjects[subject] = {
          parts: [{ name: subject, ...data }],
          final: { value },
        };
      }
    });

    const totalMarks = Object.values(finalSubjects).reduce(
      (sum, sub) => sum + (parseFloat(sub.final?.value) || 0),
      0
    );

    const average = Object.keys(finalSubjects).length
      ? parseFloat((totalMarks / Object.keys(finalSubjects).length).toFixed(1))
      : 0;

    return {
      id: studentData.id,
      studentName: studentData.studentName,
      studentNumber: studentData.studentNumber,
      position: studentData.position,
      totalMarks,
      average,
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

  // ---------- Process results ----------
  useEffect(() => {
    if (results && results.data) {
      if (Array.isArray(results.data) && results.data.length > 0) {
        const grouped = groupResultsByStudent(results.data);
        const processed = grouped
          .map((student) => processStudent(student))
          .filter((student) =>
            Object.values(student.subjects || {}).some(
              (sub) => sub?.final?.value && sub.final.value > 0
            )
          )
          // 🔥 Sort students by position (1 → last)
          .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity));

        setGroupedResults(processed);
      } else {
        setGroupedResults([]);
      }
    } else {
      setGroupedResults([]);
    }
  }, [results]);

  // ---------- SMS ----------
  const handleSendSMS = async (row) => {
    const studentId = row.id;
    setSendingStatus((prev) => ({ ...prev, [studentId]: true }));

    try {
      // Build subjects summary with only marks (no grades)
      const subjectsSummary = Object.entries(row.subjects).reduce(
        (acc, [subject, details]) => {
          const marks =
            details?.final?.value !== undefined && details?.final?.value !== null
              ? parseFloat(details.final.value) || 0
              : 0;
          acc[subject] = { marks };
          return acc;
        },
        {}
      );

      // Build payload with essential data only
      const payload = {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: parseFloat(row.totalMarks) || 0,
        average: parseFloat(row.average?.toFixed(1)) || 0,
        position: row.position ? parseInt(row.position) : 0,
        // Only include division if it exists and is not empty
        ...(row.division && row.division !== 'N/A' && row.division !== '' && {
          division: row.division
        })
      };

      await sendSmsToParents(studentId, payload);
      setSentStatus((prev) => {
        const newStatus = { ...prev, [studentId]: true };
        // Save to localStorage
        localStorage.setItem(`sentStatus_${classId}_${examinationTypeId}`, JSON.stringify(newStatus));
        return newStatus;
      });
    } catch (error) {
      console.error("❌ Error sending SMS", error);
    } finally {
      setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // ---------- Columns ----------
  const createColumns = () => {
    if (!groupedResults.length) return [];

    const subjectSet = new Set();
    groupedResults.forEach((student) =>
      Object.keys(student.subjects || {}).forEach((subj) => subjectSet.add(subj))
    );
    const subjectNames = Array.from(subjectSet);

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

    subjectNames.forEach((subject) => {
      columns.push({
        field: `subject_${subject}`,
        headerName: subject,
        flex: 1,
        minWidth: 220,
        renderCell: ({ row }) => {
          const subj = row.subjects[subject];
          if (!subj || (!subj.parts?.length && !subj.final)) return null;

          const validParts = (subj.parts || []).filter(
            (part) =>
              part.marks !== undefined &&
              part.marks !== null &&
              part.marks !== ""
          );

          if (!validParts.length && !subj.final?.value) return null;

          return (
            <Box>
              {validParts.map((part, idx) => (
                <Typography key={idx}>
                  {part.name}
                  {part.marks ? `: ${part.marks}` : ""}
                </Typography>
              ))}
              {subj.final?.value ? (
                <Box mt="5px" borderTop="1px solid #ccc" pt="5px">
                  <Typography fontWeight="bold">
                    Marks: {subj.final.value}
                  </Typography>
                </Box>
              ) : null}
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
          <Typography fontWeight="bold">{row.totalMarks || ""}</Typography>
        ),
      },
      {
        field: "average",
        headerName: "Average",
        flex: 0.5,
        minWidth: 100,
        renderCell: ({ row }) => (
          <Typography fontWeight="bold">
            {row.average ? parseFloat(row.average).toFixed(1) : ""}
          </Typography>
        ),
      },
      {
        field: "position",
        headerName: "Position",
        flex: 0.5,
        minWidth: 120,
        renderCell: ({ row }) => {
          const totalStudents = groupedResults.length;
          return (
            <Typography fontWeight="bold">
              {row.position} out of {totalStudents}
            </Typography>
          );
        },
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
                backgroundColor: sentStatus[row.id] ? "#0A6927" : undefined,
                color: sentStatus[row.id] ? "white" : undefined,
                "&:hover": {
                  backgroundColor: sentStatus[row.id] ? "#085A1F" : undefined,
                },
                "&:disabled": {
                  backgroundColor: sendingStatus[row.id] ? "#ccc" : undefined,
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
        <Header title="CLASS RESULTS" />
        <Box mb={2} display="flex" justifyContent="flex-end">
          <ExportPDFButton 
            groupedResults={groupedResults} 
            isClassResults={true}
            className={groupedResults[0]?.className || 'N/A'}
            examinationType={groupedResults[0]?.examinationType || 'N/A'}
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

export default ClassResults;
