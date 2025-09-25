import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Snackbar,
    Alert,
} from '@mui/material';


const dialogContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80px',
};

function ChangeIncidentStatusDialog({ open, onClose, incidentId, loadIncidentDetails, incidentData, loadIncidents }) {

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const updateIncidentStatus = () => {
        // Check if incidentData contains data
        // console.log('Incident Data:', incidentData);

        const updateStatusEndpoint = `http://localhost:8082/api/incident/status/${incidentId}`;

        // Define the payload to be sent with the PUT request
        const payload = {
            id: incidentId,
            status: incidentData.status === 'PENDING' ? 'SOLVED' : 'PENDING'

        };


        // Make an HTTP PUT request to update the device status
        axios
            .put(updateStatusEndpoint, payload)
            .then((response) => {

                if (response.status === 200) {

                    setSnackbar({
                        open: true,
                        message: "incident status updated successfully",
                        severity: 'success',
                    });
                    loadIncidentDetails();
                    loadIncidents();
                    onClose();

                } else {
                    setSnackbar({
                        open: true,
                        message: "failed to update incident status",
                        severity: 'error',
                    });
                    onClose();
                    console.error('Error: Something went wrong with the API request');
                }
            })
            .catch((error) => {
                // Handle any errors (e.g., show an error message)
                console.error('Error updating incident status:', error);
                console.error('Response data:', error.response?.data);
                // Close the dialog
                onClose();
            });
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogContent style={dialogContentStyle}>
                    <Typography variant="body1">
                        do  you  want  to change incident status ?
                    </Typography>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="center" mt="20px">
                        <Button onClick={updateIncidentStatus} color="error" variant="contained">
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
            {/* Snackbar for feedback messages */}
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

export default ChangeIncidentStatusDialog;