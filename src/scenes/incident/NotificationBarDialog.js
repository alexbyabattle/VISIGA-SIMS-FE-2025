import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Snackbar,
    Alert,
    useTheme,
} from '@mui/material';
import { tokens } from "../../theme";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
    paddingTop: '20px',
};

const NotificationBarDialog = ({ open, onClose, onIncidentCountUpdate }) => {
    const [details, setDetails] = useState([]);
    const [userDetails, setUserDetails] = useState(null); // State for user details
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const navigate = useNavigate();

    // Handling Snackbar close
    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };



    // Fetch user details from token
    const getUserDetailsFromToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                const { id, role, department } = decodedToken;
                return { id, role, department };
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return null;
    };



    const role = userDetails?.role;
    const department = userDetails?.department;

    const openIncidentDetailsPage = (incidentId) => {
        if (incidentId) {
            if ((role === "ADMIN" || role === "MANAGER") && department === "IT") {
                navigate(`/incidentDetails/${incidentId}`);
            } else if ((role === "USER" || role === "MANAGER") && department !== "IT") {
                navigate(`/incidentForm/${incidentId}`);
            }
        }
        if (onClose) {
            onClose();
        }
    };


    const loadIncidents = async () => {
        if (!userDetails) return;

        const { id } = userDetails;
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken || !id) {
            console.error('Access token or user ID not found in local storage');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        try {
            const response = await axios.get(`http://localhost:8082/api/incident/list/${id}`, config);
            const responseData = response.data;

            const formattedData = responseData.data
                ? responseData.data
                    .filter((item) => {
                        // Check if incidentType is SOFTWARE or HARDWARE and status is PENDING
                        const isSoftwareOrHardware = ["software", "hardware"].includes(item.incidentType.toLowerCase());
                        const isPending = item.status.toLowerCase() === "pending";
                        return isSoftwareOrHardware && isPending;
                    })
                    .map((item) => ({
                        id: item.id,
                        incidentTitle: item.incidentTitle,
                        incidentType: item.incidentType,
                        status: item.status,
                        deviceName: item.devices.map((device) => device.deviceName).join(', '),
                    }))
                    .sort((a, b) => b.id - a.id)
                : [];

            setDetails(formattedData);

            // Pass the total count of incidents to the parent
            if (onIncidentCountUpdate) {
                onIncidentCountUpdate(formattedData.length);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        const fetchedUserDetails = getUserDetailsFromToken();
        setUserDetails(fetchedUserDetails);
    }, []); // This will run only once on component mount

    useEffect(() => {
        if (userDetails) {
            loadIncidents();
        }
    }, [userDetails]); // Only run when userDetails is available

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        position: 'absolute',
                        top: '50px',
                        right: '20px',
                        margin: 0,
                    },
                }}
            >
                <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold', padding: '5px' }}>
                    ASSIGNED TASKS
                </DialogTitle>

                <DialogContent style={dialogContentStyle}>
                    {details.map((detail) => (
                        <Box
                            key={detail.id}
                            mb={2}
                            p={1}
                            style={{
                                backgroundColor: colors.primary[700],
                                borderRadius: '8px',
                                width: '100%',
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Incident Title: </strong> {detail.incidentTitle}
                            </Typography>
                            <Box
                                key={detail.id}
                                style={{
                                    backgroundColor: colors.primary[700],
                                    borderRadius: '8px',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body2">
                                    <strong> Device Name: </strong> {detail.deviceName}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '1px 3px',
                                        borderRadius: '2px',
                                        display: 'inline-block',
                                    }}
                                >
                                    {detail.status}
                                </Typography>

                                <Button
                                    onClick={() => openIncidentDetailsPage(detail.id)}
                                    color="secondary"
                                    variant="contained"
                                    sx={{ width: "60px", height: "17px" }}
                                >
                                    View
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationBarDialog;
