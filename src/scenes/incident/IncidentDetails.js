import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  IconButton,
  Snackbar,
  Container,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { AddToQueue, AddCard, ChangeCircle, DoDisturbOn } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import MyFormDialog from './IncidentAssignmentDialog';
import IswToIncident from './IswToIncidentassignmentDialog';
import ChangeStatusDialog from '../device/ChangeDeviceStatus';
import { useTheme } from '@mui/material';
import UnassignDialog from './IncidentUnassignmentDialog';
import image from '../../data/image';
import { jwtDecode } from 'jwt-decode'; 


const IncidentDetails = () => {
  const { id } = useParams(); // Extract the id parameter from the route

  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const [incidentData, setIncidentData] = useState(null);

  const loadIncidentDetails = () => {
    
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
    

    // Log the deviceId before making the request
    //// console.log('Incident ID  to  be  filled:', id);

    axios
      .get(`http://localhost:8082/api/incident/${id}`, config)
      .then((response) => {

        const { data } = response.data;
        setIncidentData(data);
      })
      .catch((error) => {
        console.error('Error fetching incident details:', error);
      });
  };

  useEffect(() => {
    loadIncidentDetails();
  }, [id]);

  

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

  const userRole = userDetails?.role;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openIncidentAssignmentDialog = (id) => {
    setIsDialogOpen(true);
  };

  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);

  const openUserUnassignmentDialog = (deviceId) => {
    setIsUnassignDialogOpen(true);
  };

  const [isIswToIncidentDialogOpen, setIsIswToIncidentDialogOpen] = useState(false);

  const openIncidentSolvingWayDialog = (incidentId) => {
    // console.log("Opening dialog for incident ID:", incidentId);
    setIsIswToIncidentDialogOpen(true);
  };

  const [isStatusOfDeviceDialogOpen, setIsStatusOfDeviceDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const openStatusOfDeviceDialog = () => {
    if (incidentData && incidentData.devices.length > 0) {
      const deviceId = incidentData.devices[0].id;
      setIsStatusOfDeviceDialogOpen(true);
      setSelectedDeviceId(deviceId);
    } else {
      console.error('No devices found for the incident');
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('success'); // Default snackbar color is 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (responseCode, responseStatus) => {
    setSnackbarMessage(responseStatus);
    setSnackbarColor(responseCode);
    setSnackbarOpen(true);
  };

  const navigate = useNavigate();

  // handling  displaying of incident Form 
  const openIncidentForm = (id) => {
    if (id) {
      navigate(`/incidentForm/${id}`);
    }
  };

  return (
    <Container maxWidth="lg"  id="incident-details" > 
        <Button
          onClick={() => openIncidentForm(id)}
          color="secondary"
          variant="contained"
          sx={{ width: "120px", height: "30px" }}
        >
          VIEW REPORT
        </Button>
      {/* Container for incident details */}
      
        {incidentData && (
          <Box elevation={3} sx={{ padding: '5px', marginBottom: '5px', border: `1px solid ${borderColor}`, marginLeft: "5px", marginRight: "5px" }}>
            <Box height="100px" sx={{ padding: 0, border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
                <img alt="gcla admin" width="100%" height="100px" src={image.george} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </Box>
              <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" align="center">
                  <h1>REPORTED INCIDENT DETAILS</h1>
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'start' }}>
                <Typography variant="h6" align="center">ID: {incidentData.id} </Typography>
                <Typography variant="h6" align="center">DATE: {incidentData.createdAt} </Typography>
              </Box>
            </Box>

            <Box elevation={3} sx={{ padding: '5px', marginBottom: '8px', border: `1px solid ${borderColor}`, marginLeft: "3px", marginRight: "3px" }}>
              <Box display="flex">
                <Box flex="1" marginRight="16px">
                  <strong style={{ marginLeft: '4px', marginRight: '15px' }}> INCIDENT: </strong>
                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                    <strong style={{ marginRight: '10px' }}>INCIDENT TITLE:</strong> {incidentData.incidentTitle}
                  </Typography>
                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                    <strong style={{ marginRight: '10px' }}>INCIDENT TYPE: </strong> {incidentData.incidentType}
                  </Typography>
                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                    <strong style={{ marginRight: '10px' }}>PRIORITY: </strong> {incidentData.priority}
                  </Typography>
                  <Typography variant="body1" style={{ marginLeft: '8px' }}>
                    <strong style={{ marginRight: '10px' }}>status: </strong>
                    <Box bgcolor={["FINE", "ACTIVE", "SOLVED", "PROVIDED", "APPROVED"].includes(incidentData.status) ? "#4CAF50" : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(incidentData.status) ? "#f44336" : "#FFFFFF"} color="#FFFFFF" p={1} borderRadius={15} width={80} height={40} display="inline-flex" justifyContent="center" alignItems="center" style={{ marginLeft: 10 }} component="span">
                      {incidentData.status}
                    </Box>
                  </Typography>
                </Box>

                <Box flex="1">
                  <strong style={{ marginLeft: '4px' }}>DEVICE:</strong>
                  <ul>
                    {incidentData.devices.map((device, index) => (
                      <li key={index}>
                        <Typography variant="body1">
                          <strong style={{ marginRight: '10px' }} >deviceName:</strong> {device.deviceName}
                        </Typography>
                        <Typography variant="body1">
                          <strong style={{ marginRight: '10px' }} > deviceNumber: </strong> {device.deviceNumber}
                        </Typography>
                        <Typography variant="body1">
                          <strong style={{ marginRight: '10px' }} > manufactural: </strong> {device.manufactural}
                        </Typography>
                        <Typography variant="body1">
                          <strong style={{ marginRight: '10px' }}> status: </strong>
                          <Box
                            bgcolor={
                              ["FINE", "Active", "Solved", "Provided", "Approved"].includes(device.status)
                                ? "#4CAF50"
                                : ["Pending", "FAULT", "PENDING", "Solution_Pending", "In_Active"].includes(device.status)
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
                            {device.status}
                          </Box>
                        </Typography>

                      </li>
                    ))}
                  </ul>
                </Box>
                <Box flex="1" >
                  <ul>
                    <strong style={{ marginLeft: '4px' }}>USER REPORTED INCIDENT: </strong>
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
            </Box>

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


                <Box display="flex" justifyContent="space-between">
                  <Box flex="1" marginRight="16px" justifyContent="column">
                    {userRole === 'MANAGER' && (
                      <>
                        <Tooltip title="Assign Admin Incident">
                          <IconButton color="success" onClick={() => openIncidentAssignmentDialog(incidentData.id)}>
                            <AddToQueue style={{ color: "green", fontSize: 32 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Unassign admin from a incident">
                          <IconButton color="success" onClick={() => openUserUnassignmentDialog(incidentData.id)}>
                            <DoDisturbOn style={{ color: "red", fontSize: 32 }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <ul>
                      <strong style={{ marginLeft: '4px' }}> INCIDENT ASSIGNED TO (IT): </strong>
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
                              <strong style={{ marginRight: '10px' }}> Assigned At: </strong> {user.createdAt}
                            </Typography>
                          </li>
                        ))}
                    </ul>
                  </Box>




                  <Box flex="1" marginRight="16px" justifyContent="column">

                    <Tooltip title="Assign ISW to Incident ">
                      <IconButton color="success" onClick={() => openIncidentSolvingWayDialog(incidentData.id)}>
                        <AddCard style={{ color: "green", fontSize: 32 }} />
                      </IconButton>
                    </Tooltip>

                    <ul>
                      <strong style={{ marginLeft: '4px' }}> SOLVING WAYS: </strong>
                      {incidentData.solvingWays

                        .map((solvingWay, index) => (
                          <li key={index}>
                            <Typography variant="body1">
                              <strong style={{ marginRight: '10px' }} > incident Soloving  Way: </strong> {solvingWay.iswName}
                            </Typography>
                            <Typography variant="body1">
                              <strong style={{ marginRight: '10px' }} > incidentCausedBy: </strong> {solvingWay.incidentCausedBy}
                            </Typography>
                            <Typography variant="body1">
                              <strong style={{ marginRight: '10px' }} > deviceToReplace: </strong>{solvingWay.deviceToReplace}
                            </Typography>
                            <Typography variant="body1">
                              <strong style={{ marginRight: '10px' }} > incidentStatus: </strong>{solvingWay.incidentStatus}
                            </Typography>
                            <Typography variant="body1">
                              <strong style={{ marginRight: '10px' }} > Solved At: </strong>{solvingWay.createdAt}
                            </Typography>
                          </li>
                        ))}
                    </ul>
                  </Box>




                  <Box flex="1">
                    <div style={{ position: 'relative' }}>
                      <Box style={{ position: 'absolute', top: '10px', left: '50px', display: 'flex', alignItems: 'center' }} >
                        <Box justifyContent="column"  >
                          <Box >
                            <strong > CHANGE DEVICE STATUS </strong>
                          </Box>
                          <Box style={{ position: 'absolute', top: '20px', left: '50px', alignItems: 'center' }}>
                            <Tooltip title="Change status of the Device">
                              <IconButton
                                onClick={() => openStatusOfDeviceDialog(incidentData.id)}
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
        incidentId={id}
        userRole={userRole}
        loadIncidentDetails={loadIncidentDetails}
      />

      <IswToIncident
        open={isIswToIncidentDialogOpen}
        onClose={() => setIsIswToIncidentDialogOpen(false)}
        incidentId={id}
        showSnackbar={showSnackbar}
        loadIncidentDetails={loadIncidentDetails}
      />

      <ChangeStatusDialog
        open={isStatusOfDeviceDialogOpen}
        onClose={() => setIsStatusOfDeviceDialogOpen(false)}
        incidentId={id}
        deviceId={selectedDeviceId}
        showSnackbar={showSnackbar}
        incidentData={incidentData}
        loadIncidentDetails={loadIncidentDetails}
      />

      <UnassignDialog
        open={isUnassignDialogOpen}
        onClose={() => setIsUnassignDialogOpen(false)}
        incidentId={id}
        userRole={userRole}
        loadIncidentDetails={loadIncidentDetails}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'buttom', horizontal: 'left' }}
        ContentProps={{
          style: {
            backgroundColor: snackbarColor === 'success' ? '#4CAF50' : snackbarColor === 'error' ? '#f44336' : '#2196F3',
          },
        }}
      />
    </Container>
  );
};

export default IncidentDetails;