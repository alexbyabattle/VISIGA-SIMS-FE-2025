import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Alert,
    Snackbar
} from '@mui/material';


const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function ChangeRequestStatusDialog({ open, onClose, incidentId, loadIncidentDetails, incidentData, loadIncidents }) {

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state to track button clicks

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getUserDetailsFromToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                // console.log('Decoded Token:', decodedToken);
                const { id, role, department } = decodedToken;
                return { id, role, department };
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return null;
    };

    const userDetails = getUserDetailsFromToken();

    const updateIncidentStatus = () => {
        if (isButtonDisabled) return; // Prevent further calls if already disabled

        setIsButtonDisabled(true); // Disable the button on the first click

        const userId = userDetails?.id;
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.error('Access token is not found');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const updateStatusEndpoint = `http://localhost:8082/api/incident/confirmRequest/${incidentId}`;
        const payload = {
            id: incidentId,
            status: incidentData.status === 'PENDING' ? 'APPROVED' : 'PENDING',
            userId: userId
        };

        axios
            .put(updateStatusEndpoint, payload, config)
            .then((response) => {
                if (response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: "Request status updated successfully",
                        severity: 'success',
                    });
                    loadIncidentDetails();
                    loadIncidents();
                    onClose();
                } else {
                    setSnackbar({
                        open: true,
                        message: "Failed to update request status",
                        severity: 'error',
                    });
                    onClose();
                    console.error('Error: Something went wrong with the API request');
                }
            })
            .catch((error) => {
                console.error('Error updating incident status:', error);
                console.error('Response data:', error.response?.data);
                onClose();
            })
            .finally(() => {
                setIsButtonDisabled(false); // Re-enable the button if necessary
            });
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogContent style={dialogContentStyle}>
                    <Typography variant="body1">
                        Do you want to confirm the request?
                    </Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button
                            onClick={updateIncidentStatus}
                            color="error"
                            variant="contained"
                            disabled={isButtonDisabled} // Disable button when clicked
                        >
                            OK
                        </Button>
                    </Box>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={onClose} color="secondary" variant="contained">
                            Cancel
                        </Button>
                    </Box>
                </DialogActions>
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
}

export default ChangeRequestStatusDialog;
