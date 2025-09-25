import React, { useState, useEffect } from 'react';
import { Box, useTheme, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";
import useTermService from '../../api/services/termService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DataGrid } from '@mui/x-data-grid';
import * as image from '../../assets';

const Student_Term_Data = () => {
    const { classId, studentId } = useParams();
    const theme = useTheme();
    const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [terms, setTerms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { GetTermsByClassId } = useTermService();

    useEffect(() => {
        const fetchData = async () => {
            if (classId) {
                setIsLoading(true);
                const data = await GetTermsByClassId(classId);
                const sortedData = (data || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setTerms(sortedData);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [classId]);

    // 🟢 Handle navigation depending on class type
    const handleViewResults = (termId) => {
        navigate(`/term_student_results/${studentId}/${classId}/${termId}`);
    };

    // 🟢 Handle navigation to evaluation report
    const handleViewEvaluationReport = (termId) => {
        navigate(`/student_evaluation_report/${termId}/${studentId}`);
    };

    // 🟢 Columns for DataGrid
    const columns = [
        {
            field: 'termName',
            headerName: 'Term Name',
            flex: 1,
            minWidth: 100,
        },

        {
            field: 'action',
            headerName: 'STUDENT REPORT',
            minWidth: 180,
            sortable: false,
            filterable: false,
            headerAlign: 'center',   
            align: 'center',         
            renderCell: (params) => (
                <Box
                    display="flex"
                    gap={1}
                    justifyContent="center"
                    mt={1}               
                >
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleViewResults(params.row.id)}
                    >
                        Results
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleViewEvaluationReport(params.row.id)}
                    >
                        REPORT
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Box sx={{ ml: '20px', mr: '20px' }}>
            {/* Header Banner */}
            <Box
                height="auto"
                display="flex"
                justifyContent="space-between"
                border={`1px solid ${borderColor}`}
                mb={2}
                flexWrap="wrap"
            >
                {/* Left */}
                <Box
                    flex={1}
                    display="flex"
                    alignItems="center"
                    borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
                    p={1}
                    justifyContent="center"
                >
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
                        <Box
                            component="img"
                            src={image.visigalogo}
                            alt="logo"
                            sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
                        />
                        <Typography
                            variant="h7"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
                        >
                            St Mary's Junior Seminary (VISIGA SEMINARY)
                        </Typography>
                    </Box>
                </Box>

                {/* Center */}
                <Box
                    flex={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRight={{ xs: 'none', md: `1px solid ${borderColor}` }}
                    p={2}
                    textAlign="center"
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.4rem' } }}
                    >
                        TERM DETAILS
                    </Typography>
                </Box>

                {/* Right */}
                <Box
                    flex={1}
                    display="flex"
                    alignItems="center"
                    p={1}
                    justifyContent="center"
                >
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
                        <Box
                            component="img"
                            src={image.cathedral5}
                            alt="arch"
                            sx={{ height: 80, width: 80, mb: { xs: 1, md: 0 }, mr: { xs: 0, md: 2 } }}
                        />
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '0.7rem', sm: '1.1rem', md: '1.5rem' } }}
                        >
                            Seminary under Archdiocese of Dar es Salaam
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Table */}
            <Box>
                <Typography variant="h4" align="start" gutterBottom>
                    LIST OF TERMS FOR {terms[0]?.className || ""}
                </Typography>

                {isLoading ? (
                    <LoadingSpinner message="Loading terms..." height="250px" />
                ) : terms.length > 0 ? (
                    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
                        <DataGrid
                            rows={terms}
                            columns={columns}
                            getRowId={(row) => row.id}
                            pageSize={5}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            sx={{
                                '& .MuiDataGrid-cell:hover': {
                                    cursor: 'default',
                                },
                            }}
                        />
                    </Box>
                ) : (
                    <Typography>No terms available.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default Student_Term_Data;

