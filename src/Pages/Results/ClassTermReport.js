import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ExportPDFButton from "../../components/ExportPDFButton";
import generateTermResultsPDF from "../../utils/termResultsPdf";

const ClassTermReport = () => {
  const location = useLocation();
  const termId = location.state?.termId;
  const classId = location.state?.id;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { getResultsByTermAndClass, sendSmsToParents } = useResultService();

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingStatus, setSendingStatus] = useState({});
  const [sentStatus, setSentStatus] = useState({});

  // Load sent status from localStorage on component mount
  useEffect(() => {
    const savedSentStatus = localStorage.getItem(`sentStatus_${classId}_${termId}`);
    if (savedSentStatus) {
      setSentStatus(JSON.parse(savedSentStatus));
    }
  }, [classId, termId]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!termId || !classId) return;

      setIsLoading(true);
      try {
        const data = await getResultsByTermAndClass(termId, classId);
        console.log("Fetched term results data:", data); // Debug log
        if (data?.data) {
          // Extract class and term info from the first result if available
          const firstResult = data.data?.[0];
          const className = data.className || firstResult?.className || "N/A";
          
          // Try multiple possible fields for term name
          const termName = data.termName || 
                          firstResult?.termName || 
                          data.term?.name || 
                          data.term?.termName ||
                          firstResult?.term?.name ||
                          firstResult?.term?.termName ||
                          "N/A";
          
          console.log("Extracted term name:", termName); // Debug log
          
          const processedWithDetails = data.data.map(student => ({
            ...student,
            className: className,
            termName: termName
          }));
          
          setResults(processedWithDetails);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [termId, classId]);

  // ---------- SMS ----------
  const handleSendSMS = async (row) => {
    const studentId = row.studentId;
    setSendingStatus((prev) => ({ ...prev, [studentId]: true }));

    try {
      // Build subjects summary with only marks (no grades)
      const subjectsSummary = Object.entries(row.subjects || {}).reduce(
        (acc, [subject, details]) => {
          // Only include subjects that are not excluded
          if (!excludedSubjects.includes(subject)) {
            const marks = details?.totalMarks || 0;
            acc[subject] = { marks };
          }
          return acc;
        },
        {}
      );

      // Extract numeric position from positionText (e.g., "2nd out of 30" -> 2)
      const extractNumericPosition = (positionText) => {
        if (!positionText) return 0;
        const match = positionText.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      // Build payload with essential data only
      const payload = {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: parseFloat(row.totalMarks) || 0,
        average: parseFloat(row.average) || 0,
        position: extractNumericPosition(row.positionText),
        // Only include division if it exists and is not empty
        ...(row.division && row.division !== 'N/A' && row.division !== '' && {
          division: row.division
        })
      };

      await sendSmsToParents(studentId, payload);
      setSentStatus((prev) => {
        const newStatus = { ...prev, [studentId]: true };
        // Save to localStorage
        localStorage.setItem(`sentStatus_${classId}_${termId}`, JSON.stringify(newStatus));
        return newStatus;
      });
    } catch (error) {
      console.error("❌ Error sending SMS", error);
    } finally {
      setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  // Subjects that should NOT be displayed
  const excludedSubjects = [
    "CHEMISTRY-1",
    "CHEMISTRY-2",
    "CHEMISTRY-3",
    "PHYSICS-1",
    "PHYSICS-2",
    "PHYSICS-3",
    "BIOLOGY-1",
    "BIOLOGY-2",
    "BIOLOGY-3",
    "HISTORY-1",
    "HISTORY-2",
    "GEOGRAPHY-1",
    "MATHEMATICS-1",
    "MATHEMATICS-2",
    "ECONOMICS-1",
    "ECONOMICS-2",
    "GEOGRAPHY-2",
  ];

  // Columns for DataGrid
  const createColumns = () => {
    if (!results.length) return [];

    // Collect all subject names except excluded ones
    const subjectSet = new Set();
    results.forEach((student) => {
      Object.keys(student.subjects || {}).forEach((subj) => {
        if (!excludedSubjects.includes(subj)) {
          subjectSet.add(subj);
        }
      });
    });

    const subjectNames = Array.from(subjectSet);

    const hasSubjectResults = (subj) =>
      subj.exam10Average > 0 ||
      subj.exam40Average > 0 ||
      subj.exam50Marks > 0;

    const columns = [
      {
        field: "studentName",
        headerName: "Student Name",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "studentNumber",
        headerName: "Index Number",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "combination",
        headerName: "Combination",
        flex: 1,
        minWidth: 150,
        renderCell: ({ row }) => (
          <Typography variant="body2" fontWeight="bold">
            {row.combination || "N/A"}
          </Typography>
        ),
      },
    ];

    // Add only allowed subject columns
    subjectNames.forEach((subject) => {
      columns.push({
        field: `subject_${subject}`,
        headerName: subject,
        flex: 1.5,
        minWidth: 220,
        renderCell: ({ row }) => {
          const subj = row.subjects[subject];
          if (!subj) return null;

          if (!hasSubjectResults(subj)) {
            return (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                No results
              </Typography>
            );
          }

          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {subj.exam10Average > 0 && (
                <Typography variant="body2">
                  Exam10 Avg: {subj.exam10Average}
                </Typography>
              )}
              {subj.exam40Average > 0 && (
                <Typography variant="body2">
                  Exam40 Avg: {subj.exam40Average}
                </Typography>
              )}
              {subj.exam50Marks > 0 && (
                <Typography variant="body2">
                  Exam50 Marks: {subj.exam50Marks}
                </Typography>
              )}
              <Typography variant="body2" fontWeight="bold">
                Total: {subj.totalMarks}
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="secondary.main"
              >
                Grade: {subj.grade ?? "-"}
              </Typography>
            </Box>
          );
        },
      });
    });

    // Summary columns
    columns.push(
      {
        field: "totalMarks",
        headerName: "Total Marks",
        flex: 0.7,
        minWidth: 120,
        renderCell: ({ row }) => {
          const subjectsWithResults = Object.entries(row.subjects || {}).filter(
            ([name, subj]) =>
              !excludedSubjects.includes(name) && hasSubjectResults(subj)
          );

          if (subjectsWithResults.length === 0) {
            return (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                No results
              </Typography>
            );
          }

          return <Typography variant="body2">{row.totalMarks}</Typography>;
        },
      },
      {
        field: "average",
        headerName: "Average",
        flex: 0.7,
        minWidth: 120,
        renderCell: ({ row }) => {
          const subjectsWithResults = Object.entries(row.subjects || {}).filter(
            ([name, subj]) =>
              !excludedSubjects.includes(name) && hasSubjectResults(subj)
          );

          if (subjectsWithResults.length === 0) {
            return (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                No results
              </Typography>
            );
          }

          return <Typography variant="body2">{row.average}</Typography>;
        },
      },
      {
        field: "positionText",
        headerName: "Position",
        flex: 0.7,
        minWidth: 120,
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
              disabled={sendingStatus[row.studentId]}
              onClick={() => handleSendSMS(row)}
              sx={{
                backgroundColor: sentStatus[row.studentId] ? "#0A6927" : undefined,
                color: sentStatus[row.studentId] ? "white" : undefined,
                "&:hover": {
                  backgroundColor: sentStatus[row.studentId] ? "#085A1F" : undefined,
                },
                "&:disabled": {
                  backgroundColor: sendingStatus[row.studentId] ? "#ccc" : undefined,
                }
              }}
            >
              {sendingStatus[row.studentId]
                ? "Sending..."
                : sentStatus[row.studentId]
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
      <Header
        title={`CLASS TERM REPORT FOR CLASS NAME: ${results[0]?.className || "N/A"} `}
      />
      <Box mb={2} display="flex" justifyContent="flex-end">
        <button
          onClick={() => generateTermResultsPDF(results, results[0]?.termName || 'N/A', results[0]?.className || 'N/A')}
          disabled={!results || results.length === 0}
          style={{
            padding: "5px 10px",
            backgroundColor: (!results || results.length === 0) ? "#cccccc" : "#502eccff",
            color: (!results || results.length === 0) ? "#666666" : "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: (!results || results.length === 0) ? "not-allowed" : "pointer",
            marginBottom: "1px",
            boxShadow: (!results || results.length === 0) ? "none" : "0 4px 6px rgba(248, 244, 244, 0.9)",
            opacity: (!results || results.length === 0) ? 0.6 : 1,
          }}
          onMouseOver={(e) => {
            if (results && results.length > 0) {
              e.target.style.backgroundColor = "#3d2399";
            }
          }}
          onMouseOut={(e) => {
            if (results && results.length > 0) {
              e.target.style.backgroundColor = "#502eccff";
            }
          }}
        >
          📄 Export as PDF
        </button>
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : results.length > 0 ? (
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
            rows={results.map((s, idx) => ({ ...s, id: s.studentId || idx }))}
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
          No results found for this term and class
        </Typography>
      )}
    </Box>
  );
};

export default ClassTermReport;