import React, { useState, useEffect, useCallback } from 'react';
import { Box, useTheme, Typography, Button } from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate, useParams } from "react-router-dom";
import useSessionService from '../../api/services/sessionService';
import Table from '../../components/Table';
import Header from "../../components/Header";


const Sessions = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { userId } = useParams();
    const { sessions, totalRecords, fetchSessions } = useSessionService();
    const [page, setPage] = useState(0);
    const [size] = useState(10);

    useEffect(() => {
        if (userId && !isNaN(page)) {
            fetchSessions(userId, page, size);
        }
    }, [userId, page, size]);

    const handlePageChange = useCallback((newPage) => {
        if (!isNaN(newPage)) {
            setPage(newPage);
        }
    }, []);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "start", headerName: "Start Time", flex: 1 },
        { field: "end", headerName: "End Time", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
    ];

    return (
        <Box m="0px">
            <Box p={2} ml={2} mr={2}>
                <Header title="SESSION" />
                <Table
                    rows={sessions}
                    columns={columns}
                    totalRecords={totalRecords}
                    size={size}
                    page={page} 
                    handlePageChange={handlePageChange}
                    colors={colors}
                />
            </Box>
        </Box>
    );
};

export default Sessions;
