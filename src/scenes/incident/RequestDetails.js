import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography,
    Box,
    IconButton,
    Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, AddCard, ChangeCircle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './IncidentAssignmentDialog';
import IswToIncident from './IswToIncidentassignmentDialog';
import ChangeRequestStatusDialog from './ChangeRequestStatusDialog';
import { useTheme } from '@mui/material';
import image from '../../data/image';


const RequestDetails = () => {

    const theme = useTheme();
    const borderColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000';

    const { id } = useParams(); // Extract the id parameter from the route

    const [incidentData, setIncidentData] = useState(null);

    const getAuthConfig = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('Access token not found in local storage');
            return {};
        }
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
    };

    const loadIncidentDetails = () => {
        // console.log('Fetching incident details for ID:', id);

        // Verify the Axios GET request payload
        axios
            .get(`http://localhost:8082/api/incident/${id}`, getAuthConfig())
            .then((response) => {

                const { data } = response.data;
                setIncidentData(data);
            })
            .catch((error) => {

                console.error('Full error object:', error);
            });
    };

    useEffect(() => {
        loadIncidentDetails();
    }, [id]);


    // handling opening and closing of IncidentASsignment to admin  Dialog  
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openIncidentAssignmentDialog = (incidentId) => {
        setIsDialogOpen(true);
    };

    

  // handling  displaying of incident Form 

  const navigate = useNavigate();

  const openIncidentForm = (id) => {
    if (id) {
      navigate(`/requestForm/${id}`);
    }
  };


    // handling opening and closing of solving way to incident Dialog  

    const [isIswToIncidentDialogOpen, setIsIswToIncidentDialogOpen] = useState(false);

    const openIncidentSolvingWayDialog = (incidentId) => {
        setIsIswToIncidentDialogOpen(true);
    };


    // handling opening and closing of changing status of incident Dialog  


    const [isStatusOfIncidentDialogOpen, setIsStatusOfIncidentDialogOpen] = useState(false);

    const openStatusOfIncidentDialog = (incidentId) => {
        setIsStatusOfIncidentDialogOpen(true);
    };


    return (

        <Box
            elevation={3}

        >
            <Button
                onClick={() => openIncidentForm(id)}
                color="secondary"
                variant="contained"
                sx={{ width: "120px", height: "30px" }}
            >
                VIEW REPORT
            </Button>
            {incidentData && (
                <Box
                    elevation={3}
                    //height="200px"
                    sx={{
                        padding: '5px',
                        marginBottom: '8px',
                        border: `1px solid ${borderColor}`,
                        marginLeft: "3px",
                        marginRight: "3px",
                    }}

                >

                    <Box
                        height="100px"
                        sx={{
                            padding: 0,
                            border: `1px solid ${borderColor}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                        }}
                    >
                        <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
                            <img
                                alt="gcla admin"
                                width="100%"
                                height="100px"
                                src={image.george}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </Box>
                        <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h5" align="center"> <h1>REPORTED REQUEST DETAILS</h1></Typography>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'start',
                                justifyContent: 'start'
                            }}
                        >
                            <Typography variant="h6" align="center">ID: {incidentData.id} </Typography>
                            <Typography variant="h6" align="center">DATE: {incidentData.createdAt} </Typography>
                        </Box>


                    </Box>

                    <Box
                        elevation={3}
                        //height="200px"
                        sx={{
                            padding: '5px',
                            marginBottom: '2px',
                            border: `1px solid ${borderColor}`,
                            marginLeft: "3px",
                            marginRight: "3px",
                            display: 'flex',
                            flexDirection: 'row'
                        }}

                    >
                        <Box flex="1" marginRight="16px">
                            <strong style={{ marginLeft: '4px', marginRight: '15px' }}>   REQUESTS:  </strong>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '10px' }}  >DESCRIPTION OF REQUEST:</strong> {incidentData.incidentTitle}
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '10px' }} >REQUESTION TYPE :  </strong> {incidentData.incidentType}
                            </Typography>
                            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                                <strong style={{ marginRight: '1px' }}> status: </strong>
                                <Box
                                    bgcolor={
                                        ["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(incidentData.status)
                                            ? "#4CAF50"
                                            : ["Pending", "FAULT", "PENDING", "SOLUTION_PENDING", "In_Active"].includes(incidentData.status)
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


                    </Box>

                    {incidentData && (
                        <Box
                            elevation={3}
                            height="160px"
                            sx={{
                                padding: '5px',
                                marginBottom: '4px',
                                border: `1px solid ${borderColor}`,
                                marginLeft: "3px",
                                marginRight: "3px",
                            }}

                        >


                            <Box display="flex" justifyContent="space-between">
                                <Box flex="1" marginRight="16px" justifyContent="column">

                                    <ul>
                                        <strong style={{ marginLeft: '4px' }}> INCIDENT APPROVED  BY: </strong>
                                        {incidentData.users
                                            .filter(user => user.department === 'IT')
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
                                                    <Typography variant="body1">
                                                        <strong style={{ marginRight: '10px' }}> Confirmed-At: </strong> {user.createdAt}
                                                    </Typography>
                                                </li>
                                            ))}
                                    </ul>
                                </Box>




                                <Box flex="1">
                                    <div style={{ position: 'relative' }}>
                                        <Box style={{ position: 'absolute', top: '20px', left: '50px', display: 'flex', alignItems: 'center' }} >
                                            <Box justifyContent="column"  >
                                                <Box>
                                                    <strong > REQUEST-STATUS </strong>
                                                </Box>
                                                <Box style={{ position: 'absolute', top: '20px', left: '40px', alignItems: 'center' }}>
                                                    <Tooltip title="Change status of the Device">
                                                        <IconButton
                                                            onClick={() => openStatusOfIncidentDialog(incidentData.id)}
                                                            sx={{ bgcolor: 'secondary.main', width: 60, height: 60 }}
                                                        >
                                                            <ChangeCircle style={{ color: "white", fontSize: 32 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Box>
                                        </Box>

                                    </div>
                                </Box>




                            </Box>
                        </Box>

                    )}

                </Box>
            )}





            <MyFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                loadIncidentDetails={loadIncidentDetails}
                selectedIncidents={[id]}
            />

            <IswToIncident
                open={isIswToIncidentDialogOpen}
                onClose={() => setIsIswToIncidentDialogOpen(false)}
                loadIncidentDetails={loadIncidentDetails}
                selectedIncidents={[id]}
            />


            <ChangeRequestStatusDialog
                open={isStatusOfIncidentDialogOpen}
                onClose={() => setIsStatusOfIncidentDialogOpen(false)}
                incidentId={incidentData ? incidentData.id : null}
                loadIncidentDetails={loadIncidentDetails}
                incidentData={incidentData}
            />




        </Box>
    );
};

export default RequestDetails;
