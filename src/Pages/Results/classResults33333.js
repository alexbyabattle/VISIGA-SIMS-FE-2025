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
    const classId = location.state?.id;
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

    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true);
            try {
                console.log('Loading results for classId:', classId, 'examinationTypeId:', examinationTypeId);
                const data = await fetchClassResults(classId, examinationTypeId);
                console.log('Fetched results data:', data);
                setResults(data);
            } catch (e) {
                console.error('Error loading results:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadResults();
    }, []);

    const getGrade = (marks) => {
        if (marks >= 75) return "A";
        if (marks >= 65) return "B";
        if (marks >= 50) return "C";
        if (marks >= 45) return "D";
        if (marks >= 35) return "E";
        return "F";
    };

    const getGradePoint = (grade) => {
        switch (grade) {
            case "A": return 1;
            case "B": return 2;
            case "C": return 3;
            case "D": return 4;
            case "E": return 5;
            case "F": return 6;
            default: return 0;
        }
    };

    const getDivisionLabel = (points) => {
        if (points >= 1 && points <= 17) return `Division 1 .${points}`;
        if (points >= 18 && points <= 20) return `Division 2 .${points}`;
        if (points >= 21 && points <= 24) return `Division 3 .${points}`;
        if (points >= 25 && points <= 29) return `Division 4 .${points}`;
        return `Division 0 .${points}`;
    };

    const calculateGeneralValue = (subject, parts) => {
        if (["PHYSICS", "CHEMISTRY", "BIOLOGY"].includes(subject)) {
            const s1 = parseFloat(parts.find((p) => p.name.endsWith("1"))?.marks) || 0;
            const s2 = parseFloat(parts.find((p) => p.name.endsWith("2"))?.marks) || 0;

            let value = null;
            if (s1 && s2) {
                value = ((s1 + s2) / 150 * 100).toFixed(2);
            } else if (s1) {
                value = s1.toFixed(2);
            } else if (s2) {
                value = s2.toFixed(2);
            }

            return value !== null ? { value: parseFloat(value), grade: getGrade(parseFloat(value)) } : null;
        }

        if (parts.length === 1) {
            const marks = parseFloat(parts[0].marks) || 0;
            const grade = getGrade(marks);
            return { value: marks, grade };
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

    const determineDivision = (subjects) => {
        const coreSubjectsOnly = subjects.filter((sub) =>
            CORE_SUBJECTS.includes(sub.subject)
        );
        const pointsArray = coreSubjectsOnly.map((sub) => getGradePoint(sub.grade));
        if (pointsArray.length <= 7) {
            return pointsArray.reduce((sum, point) => sum + point, 0);
        } else {
            const bestSeven = pointsArray.sort((a, b) => a - b).slice(0, 7);
            return bestSeven.reduce((sum, point) => sum + point, 0);
        }
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
                finalSubjects[subject] = {
                    parts: [{ name: subject, ...data }],
                    final: {
                        value: parseFloat(data.marks) || 0,
                        grade: data.grade,
                    },
                };
            }
        });

        const totalMarks = parseFloat(
            Object.values(finalSubjects)
                .reduce((sum, sub) => sum + (parseFloat(sub.final?.value) || 0), 0)
                .toFixed(2)
        );

        const average = Object.keys(finalSubjects).length
            ? totalMarks / Object.keys(finalSubjects).length
            : 0;

        const divisionPoints = determineDivision(
            Object.entries(finalSubjects).map(([subject, sub]) => ({
                subject,
                grade: sub.final.grade,
            }))
        );
        const division = getDivisionLabel(divisionPoints);

        return {
            id: studentData.id,
            studentName: studentData.studentName,
            studentNumber: studentData.studentNumber,
            position: studentData.position,
            totalMarks: totalMarks,
            average: parseFloat(average.toFixed(2)),
            division,
            subjects: finalSubjects,
        };
    };

    useEffect(() => {
        if (results && results.data) {
            console.log('Processing results data:', results.data);
            
            // Check if results.data is an array and not empty
            if (Array.isArray(results.data) && results.data.length > 0) {
                const grouped = groupResultsByStudent(results.data);
                console.log('Grouped results:', grouped);
                const processed = grouped
                    .map((student) => processStudent(student))
                    // Filter: Only keep students with at least one subject with marks > 0
                    .filter((student) => {
                        return Object.values(student.subjects || {}).some(
                            (sub) => sub?.final?.value && sub.final.value > 0
                        );
                    });

                console.log('Processed results:', processed);
                // Use backend positions instead of recalculating
                const sorted = processed
                    .sort((a, b) => b.totalMarks - a.totalMarks);

                console.log('Final sorted results:', sorted);
                setGroupedResults(sorted);
            } else {
                console.log('No results found in data array');
                setGroupedResults([]);
            }
        } else {
            console.log('No results data available:', results);
            setGroupedResults([]);
        }
    }, [results]);

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
                grade: item.grade,
            };
        });

        return Object.values(studentMap);
    };

    const handleSendSMS = async (row) => {
        const studentId = row.id;
        setSendingStatus((prev) => ({ ...prev, [studentId]: true }));

        try {
            const subjectsSummary = Object.entries(row.subjects).reduce(
                (acc, [subject, details]) => {
                    const marks =
                        details?.final?.value !== undefined && details?.final?.value !== null
                            ? parseFloat(details.final.value) || 0
                            : 0;
                    const grade = details?.final?.grade || "N/A";
                    acc[subject] = { marks, grade };
                    return acc;
                },
                {}
            );

            const payload = {
                studentName: row.studentName,
                studentNumber: row.studentNumber,
                subjects: subjectsSummary,
                totalMarks: parseFloat(row.totalMarks) || 0,
                average: parseFloat(row.average) || 0,
                division: row.division,
                position: row.position ? parseInt(row.position) : 0,
            };

            await sendSmsToParents(studentId, payload);
            setSentStatus((prev) => ({ ...prev, [studentId]: true }));
        } catch (error) {
            console.error("❌ Error sending SMS", error);
        } finally {
            setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
        }
    };

    const createColumns = () => {
        if (!groupedResults.length) return [];

        const subjectSet = new Set();
        groupedResults.forEach((student) => {
            Object.keys(student.subjects || {}).forEach((subj) =>
                subjectSet.add(subj)
            );
        });
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
                                        marks: {subj.final.value} - {subj.final.grade}
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
                    <Typography fontWeight="bold">{row.average || ""}</Typography>
                ),
            },
            {
                field: "division",
                headerName: "Division",
                flex: 0.7,
                minWidth: 120,
                renderCell: ({ row }) => (
                    <Typography fontWeight="bold">{row.division || ""}</Typography>
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
                            color={sentStatus[row.id] ? "success" : "secondary"}
                            disabled={sendingStatus[row.id] || sentStatus[row.id]}
                            onClick={() => handleSendSMS(row)}
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
                    <ExportPDFButton groupedResults={groupedResults} />
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
