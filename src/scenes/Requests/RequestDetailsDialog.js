import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    Tooltip,

} from '@mui/material';



const RequestDetailsDialog = ({ id, open, onClose }) => {

    const [incidentData, setIncidentData] = useState(null);

    useEffect(() => {

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.error('Access token not found in local storage');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };


        axios
            .get(`http://localhost:8082/api/incident/${id}` , config )
            .then((response) => {
                // Extract the "data" field from the response
                const { data } = response.data;
                setIncidentData(data);
            })
            .catch((error) => {
                console.error('Error fetching incident details:', error);
                // Log the entire error object for more information
                console.error('Full error object:', error);
            });
    }, [id]);




    // handling opening and closing of IncidentASsignment to admin  Dialog  
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openIncidentAssignmentDialog = (incidentId) => {
        setIsDialogOpen(true);
    };





    // handling opening and closing of changing status of device Dialog  

    const [isStatusOfDeviceDialogOpen, setIsStatusOfDeviceDialogOpen] = useState(false);

    const openStatusOfDeviceDialog = (incidentId) => {
        setIsStatusOfDeviceDialogOpen(true);
    };



    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle> REQUEST  DETAILS </DialogTitle>
            <DialogContent>

                {incidentData && (
                    <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>

                        <Box display="flex">
                            <Box flex="1" marginRight="16px">
                                <strong style={{ marginLeft: '4px', marginRight: '15px' }}>   REQUESTS:  </strong>
                                <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    <strong style={{ marginRight: '10px' }}  >DESCRIPTION OF INCIDENT:</strong> {incidentData.incidentTitle}
                                </Typography>
                                <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    <strong style={{ marginRight: '10px' }} >REQUESTION TYPE :  </strong> {incidentData.incidentType}
                                </Typography>
                                <Typography variant="body1">
                                    <strong style={{ marginRight: '10px' }}> status: </strong>
                                    <Box
                                        bgcolor={
                                            ["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(incidentData.status)
                                                ? "#4CAF50"
                                                : ["Pending", "FAULT", "PENDING", "SOLUTION_PENDING", "IN_ACTIVE"].includes(incidentData.status)
                                                    ? "#f44336"
                                                    : "#FFFFFF"
                                        }
                                        color="#FFFFFF"
                                        p={1}
                                        borderRadius={15}
                                        width={80}
                                        height={40}
                                        display="inline-flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ marginLeft: 10 }}

                                        component="span"
                                    >
                                        {incidentData.status}
                                    </Box>
                                </Typography>
                                <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                    <strong style={{ marginRight: '10px' }}> SUBMITTED AT :</strong> {incidentData.createdAt}
                                </Typography>
                            </Box>




                            <Box flex="1" >
                                <ul>
                                    <strong style={{ marginLeft: '4px' }}>USER : </strong>
                                    {incidentData.users
                                        .filter(user => user.department !== 'IT')
                                        .map((user, index) => (
                                            <li key={index}>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}>UserName:</strong> {user.name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > department: </strong> {user.department}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}> location: </strong> {user.location}
                                                </Typography>
                                            </li>
                                        ))}
                                </ul>
                            </Box>


                            <Box display="flex" justifyContent="space-between">
                            <Box flex="1" marginRight="16px" justifyContent="column">
                                <ul>
                                    <strong style={{ marginLeft: '4px' }}> IT CONFIRMED THE REQUEST: </strong>
                                    {incidentData.users
                                        .filter(user => user.department === 'IT')
                                        .map((user, index) => (
                                            <li key={index}>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}>UserName: </strong> {user.name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > phoneNumber: </strong> {user.phoneNumber}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }} > department: </strong> {user.department}
                                                </Typography>
                                                <Typography variant="body1">
                                                    <strong style={{ marginRight: '10px' }}> location:  </strong> {user.location}
                                                </Typography>
                                            </li>
                                        ))}
                                </ul>
                            </Box>

                        </Box>


                        </Box>
                    </Box>
                )}

                {incidentData && (
                    <Box elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>


                        
                    </Box>
                )}


            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequestDetailsDialog;
