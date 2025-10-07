import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ExportPDFButton from "../../components/ExportPDFButton";

const AlevelClassResults = () => {
  const location = useLocation();
  const classId = location.state?.classId || location.state?.id;
  const examinationTypeId = location.state?.examId;

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

  // Core subject list
  const CORE_SUBJECTS = [
    "PHYSICS",
    "CHEMISTRY",
    "BIOLOGY",
    "MATHEMATICS",
    "ECONOMICS",
    "HISTORY",
    "GEOGRAPHY",
    "GENERAL-STUDIES",
    "LANGUAGE",
    "BAM",
  ];

  useEffect(() => {
    const loadResults = async () => {
      if (!classId || !examinationTypeId) return;

      setIsLoading(true);
      try {
        const data = await fetchClassResults(classId, examinationTypeId);
        setResults(data);
      } catch (e) {
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadResults();
  }, [classId, examinationTypeId]);

  const calculateGeneralValue = (subject, parts) => {
    if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
      const total = parts.reduce((sum, part) => {
        const marks = parseFloat(part.marks) || 0;
        return sum + marks;
      }, 0);
      return { value: total };
    }

    if (parts.length === 1) {
      const marks = parseFloat(parts[0].marks) || 0;
      return { value: marks };
    }

    if (parts.length > 1) {
      const totalMarks = parts.reduce((sum, part) => {
        const marks = parseFloat(part.marks) || 0;
        return sum + marks;
      }, 0);
      return { value: totalMarks };
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
        finalSubjects[subject] = {
          parts: data,
          final: result,
        };
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

    const subjectsWithMarks = Object.values(finalSubjects).filter(
      sub => sub.final?.value !== undefined && sub.final?.value !== null && sub.final.value > 0
    );
    
    const average = subjectsWithMarks.length > 0
      ? parseFloat((totalMarks / subjectsWithMarks.length).toFixed(1))
      : 0;

    return {
      id: studentData.id,
      studentName: studentData.studentName,
      studentNumber: studentData.studentNumber,
      position: 0,
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

  useEffect(() => {
    if (results && results.data && Array.isArray(results.data) && results.data.length > 0) {
      const grouped = groupResultsByStudent(results.data);
      const processed = grouped
        .map((student) => processStudent(student))
        .filter((student) =>
          Object.values(student.subjects || {}).some(
            (sub) =>
              (sub?.final?.value !== undefined && sub?.final?.value !== null) ||
              (sub?.parts && sub.parts.length > 0)
          )
        )
        .sort((a, b) => (b.average || 0) - (a.average || 0))
        .map((student, index) => ({
          ...student,
          position: index + 1
        }));

      setGroupedResults(processed);
    } else {
      setGroupedResults([]);
    }
  }, [results]);

  const handleSendSMS = async (row) => {
    const studentId = row.id;
    setSendingStatus((prev) => ({ ...prev, [studentId]: true }));

    try {
      const subjectsSummary = Object.entries(row.subjects).reduce(
        (acc, [subject, details]) => {
          const marks = details?.final?.value !== undefined && details?.final?.value !== null
            ? parseFloat(details.final.value) || 0
            : 0;
          acc[subject] = { marks };
          return acc;
        },
        {}
      );

      const payload = {
        studentName: row.studentName,
        studentNumber: row.studentNumber,
        subjects: subjectsSummary,
        totalMarks: parseFloat(row.totalMarks) || 0,
        average: parseFloat(row.average?.toFixed(1)) || 0,
        position: row.position ? parseInt(row.position) : 0,
        ...(row.division && row.division !== "N/A" && row.division !== "" && {
          division: row.division,
        }),
      };

      await sendSmsToParents(studentId, payload);
      setSentStatus((prev) => {
        const newStatus = { ...prev, [studentId]: true };
        localStorage.setItem(
          `sentStatus_${classId}_${examinationTypeId}`,
          JSON.stringify(newStatus)
        );
        return newStatus;
      });
    } catch (error) {
      console.error("Error sending SMS", error);
    } finally {
      setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
    }
  };

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
          if (!subj) return "";

          const validParts = (subj.parts || []).filter(
            (part) => part.marks !== undefined && part.marks !== null && part.marks !== ""
          );

          if (!validParts.length && !subj.final?.value) return "";

          return (
            <Box>
              {validParts.map((part, idx) => (
                <Typography key={idx}>
                  {part.name}
                  {part.marks !== undefined && part.marks !== null ? `: ${part.marks}` : ""}
                </Typography>
              ))}
              {subj.final?.value !== undefined && subj.final?.value !== null && (
                <Box mt="5px" borderTop="1px solid #ccc" pt="5px">
                  <Typography fontWeight="bold">
                    Marks: {subj.final.value}
                  </Typography>
                </Box>
              )}
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
        minWidth: 150,
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

export default AlevelClassResults;
