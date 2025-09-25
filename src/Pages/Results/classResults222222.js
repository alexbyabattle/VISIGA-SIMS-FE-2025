import { Box, Button, Typography, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import useResultService from "../../api/services/ResultsService";
import Table from "../../components/Table";
import LoadingSpinner from "../../components/LoadingSpinner";


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

    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true);
            try {
                const data = await fetchClassResults(classId, examinationTypeId);
                setResults(data);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        loadResults();
    }, []);

    useEffect(() => {
        if (results && results.data) {
            const grouped = groupResultsByStudent(results.data);

            // Sort by average descending
            const sorted = grouped
                .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
                .map((student, index) => ({
                    ...student,
                    position: index + 1,
                    division: getDivisionLabel(determineDivision(Object.values(student.subjects))),
                }));

            setGroupedResults(sorted);
        }
    }, [results]);

    // Helper functions
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
        if (points >= 1 && points <= 17) return `Division 1 . ${points}`;
        if (points >= 18 && points <= 20) return `Division 2 . ${points}`;
        if (points >= 21 && points <= 24) return `Division 3 . ${points}`;
        if (points >= 25 && points <= 29) return `Division 4 . ${points}`;
        return `Division 0 . ${points}`;
    };

    const determineDivision = (subjects) => {
        const pointsArray = subjects.map(sub => getGradePoint(sub.grade));
        if (pointsArray.length <= 7) {
            return pointsArray.reduce((sum, point) => sum + point, 0);
        } else {
            const bestSeven = pointsArray.sort((a, b) => a - b).slice(0, 7);
            return bestSeven.reduce((sum, point) => sum + point, 0);
        }
    };

    const groupResultsByStudent = (data) => {
        const studentMap = {};
        const allSubjects = new Set();

        data.forEach(item => {
            allSubjects.add(item.subjectName);
            if (!studentMap[item.studentId]) {
                studentMap[item.studentId] = {
                    id: item.studentId,
                    studentName: item.studentName,
                    studentNumber: item.studentNumber,
                    subjects: {}
                };
            }
            studentMap[item.studentId].subjects[item.subjectName] = {
                marks: parseInt(item.marks) || 0,
                grade: item.grade || "-"
            };
        });

        return Object.values(studentMap).map(student => {
            allSubjects.forEach(subject => {
                if (!student.subjects[subject]) {
                    student.subjects[subject] = { marks: 0, grade: "-" };
                }
            });

            const subjects = Object.entries(student.subjects);
            const totalMarks = subjects.reduce((sum, [_, subj]) => sum + (parseInt(subj.marks) || 0), 0);
            const average = subjects.length > 0 ? (totalMarks / subjects.length).toFixed(2) : 0;

            return {
                ...student,
                totalMarks,
                average,
                subjects: student.subjects
            };
        });
    };

    const createColumns = () => {
        if (!groupedResults.length) return [];

        const subjectNames = [];
        groupedResults.forEach(student => {
            Object.keys(student.subjects).forEach(subject => {
                if (!subjectNames.includes(subject)) {
                    subjectNames.push(subject);
                }
            });
        });

        const columns = [
            {
                field: "studentName",
                headerName: "Student Name",
                flex: 1,
                minWidth: 150,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentName}</Typography>
            },
            {
                field: "studentNumber",
                headerName: "Index Number",
                flex: 1,
                minWidth: 150,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.studentNumber}</Typography>
            }
        ];

        subjectNames.forEach(subject => {
            columns.push({
                field: `subject_${subject}`,
                headerName: subject,
                flex: 1,
                minWidth: 70,
                renderCell: ({ row }) => {
                    const subjectData = row.subjects[subject];
                    if (!subjectData) return <Typography color="textSecondary">-</Typography>;
                    return (
                        <Box>
                            <Typography>Marks: {subjectData.marks}</Typography>
                            <Typography>Grade: {subjectData.grade}</Typography>
                        </Box>
                    );
                }
            });
        });

        const handleSendSMS = async (row) => {
            const studentId = row.id;

            setSendingStatus((prev) => ({ ...prev, [studentId]: true }));

            try {
                const payload = {
                    studentName: row.studentName,
                    subjects: row.subjects,
                    totalMarks: row.totalMarks,
                    average: row.average,
                    division: row.division,
                    position: row.position
                };

                await sendSmsToParents(studentId, payload);

                setSentStatus((prev) => ({ ...prev, [studentId]: true }));
            } catch (error) {
                console.error("Error sending SMS", error);
            } finally {
                setSendingStatus((prev) => ({ ...prev, [studentId]: false }));
            }
        };

        columns.push(
            {
                field: "totalMarks",
                headerName: "Total Marks",
                flex: 0.8,
                minWidth: 50,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.totalMarks}</Typography>
            },
            {
                field: "average",
                headerName: "Average",
                flex: 0.8,
                minWidth: 50,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.average}</Typography>
            },
            {
                field: "division",
                headerName: "Division",
                flex: 1,
                minWidth: 100,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.division}</Typography>
            },
            {
                field: "position",
                headerName: "Position",
                flex: 0.5,
                renderCell: ({ row }) => <Typography fontWeight="bold">{row.position}</Typography>
            },
            {
                field: "action",
                headerName: "Action",
                flex: 0.7,
                minWidth: 120,
                renderCell: ({ row }) => (
                    <Box width="100%" display="flex" justifyContent="center" alignItems="center">
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
                                    : "SEND SMS"}
                        </Button>
                    </Box>
                )
            }
        );

        return columns;
    };

    return (
        <Box m="0px">
            <Box p={2} ml={2} mr={2}>
                <Header title="CLASS RESULTS" />
                <Box mb={2}>
                    <ExportPDFButton groupedResults={groupedResults} />
                </Box>

                {isLoading ? (
                    <LoadingSpinner />
                ) : groupedResults.length > 0 ? (
                    <Table
                        rows={groupedResults}
                        columns={createColumns()}
                        totalRecords={results?.totalRecords || 0}
                        colors={colors}
                        size={100}
                    />
                ) : (
                    <Typography variant="h6" color="textSecondary" textAlign="center" mt={4}>
                        No results found
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ClassResults;
