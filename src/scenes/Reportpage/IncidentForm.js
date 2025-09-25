import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Grid,
  Box,
  Typography,
  Container,
  Button,
  

} from '@mui/material';
import { useTheme } from '@mui/material';
import image from '../../data/image';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import { PictureAsPdf  } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const ReportForm = () => {

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

  // handling opening and closing of changing status of incident Dialog  

  const [isStatusOfIncidentDialogOpen, setIsStatusOfIncidentDialogOpen] = useState(false);

  const openStatusOfIncidentDialog = (incidentId) => {
    setIsStatusOfIncidentDialogOpen(true);
  };

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

  const userDetails = getUserDetailsFromToken();
  const navigate = useNavigate();

  // PDF Generation function
  const generatePDF = () => {
    const input = document.getElementById('incident-details');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`incident_${id}_details.pdf`);
      });
    } else {
      console.error('Element with ID "incident-details" not found.');
    }
  };

  return (
    <Box>
      <Box style={{ marginTop: '0px', marginLeft: '300px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PictureAsPdf />}
          onClick={generatePDF}
          disabled={!incidentData}
        >
          Download PDF
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openStatusOfIncidentDialog(incidentData.id)}
          disabled={!incidentData}
        >
           CHANGE STATUS
        </Button>
        
      </Box>
      <Container
        id="incident-details"
        maxWidth="lg"  // Set to a larger maxWidth or use "xl" for extra large
        sx={{
          backgroundColor: 'white',
          padding: '10px',
          width: '55%', // Ensure it occupies full width

          height: '1000px', // Reduced height
          color: 'black', // Set text color to black
          '& .MuiTextField-root, & .MuiTypography-root': {
            color: 'black', // Ensures text fields and typography are black
          },
        }}
      >

        {incidentData && (
          <Box
            sx={{
              mt: 1,
              p: 1,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header */}
            <Box
              height="80px" // Reduced height
              sx={{
                padding: 0,
                border: '1px solid black', // Set border color to black
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px', // Reduced margin
              }}
            >
              <Box sx={{ flex: 1, borderRight: '1px solid black', p: 0, overflow: 'hidden' }}> {/* Set borderRight color to black */}
                <img
                  alt="gcla admin"
                  width="100%"
                  height="80px" // Reduced height
                  src={image.george}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </Box>
              <Box sx={{ flex: 1, borderRight: '1px solid black', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}> {/* Set borderRight color to black */}
                <Typography variant="h6" align="center" sx={{ fontSize: '1rem' }}>INCIDENT REPORTING FORM</Typography> {/* Reduced font size */}
              </Box>
              <Box
                sx={{
                  flex: 1,
                  p: 1, // Reduced padding
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  justifyContent: 'start'
                }}
              >
                <Typography variant="h6" align="center" sx={{ fontSize: '0.9rem' }}>INCIDENT ID: {incidentData.id} </Typography> {/* Reduced font size */}
                <Typography variant="h6" align="center" sx={{ fontSize: '0.9rem' }}>DATE: {incidentData.createdAt} </Typography> {/* Reduced font size */}
              </Box>
            </Box>


            <Grid container spacing={1}> {/* Reduced spacing */}
              {/* Use a reduced size for text fields */}
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> ORGANIZATION </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}> GOVERNMENT CHEMITRY LABORATORY AUTHORITY (GCLA) </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> BRANCH </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}> DAR-ES-SALAAM </span>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ color: 'black' }}>
                  <strong> INCIDENT DETAILS </strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> DATE AND TIME </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>{incidentData.createdAt}</span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> INCIDENT TYPE  </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>{incidentData.incidentType}</span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> DEVICE </label>
                  <span style={{ display: 'block', marginTop: '2px', marginLeft: '2px' }}>
                    {incidentData?.devices?.[0]?.deviceName || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> MANUFACTURAL </label>
                  <span style={{ display: 'block', marginTop: '2px', marginLeft: '2px' }}>
                    {incidentData?.devices?.[0]?.manufactural || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> INCIDENT PRIORITY  </label>
                  <span style={{ display: 'block', marginTop: '2px', marginLeft: '2px' }}>{incidentData.priority}</span>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> INCIDENT DESCRIPTION </label>
                  <span style={{ display: 'block', marginTop: '2px', marginLeft: '2px' }}>{incidentData.incidentTitle}</span>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ color: 'black' }}>
                  <strong> USER REPORTED INCIDENT DETAILS </strong>
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> REPORTED BY </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[0]?.name || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> DEPARTMENT </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[0]?.department || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> LOCATION </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[0]?.location || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> PHONE NUMBER </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[0]?.phoneNumber || 'N/A'}
                  </span>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography style={{ color: 'black' }}>
                  <strong> ICT OFFICE INCIDENT RESOLUTION </strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label>TASK ASSIGNED TO </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[1]?.name || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> PHONE-NUMBER </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[1]?.phoneNumber || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> DEPARTMENT </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[1]?.department || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> ASSIGNED AT </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.users?.[1]?.createdAt || 'N/A'}
                  </span>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label>  INCIDENT SOLVING WAY  </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.solvingWays?.[0]?.iswName || 'N/A'}
                  </span>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label>  INCIDENT CAUSED BY </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.solvingWays?.[0]?.incidentCausedBy || 'N/A'}
                  </span>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> DEVICE REPLACED </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.solvingWays?.[0]?.deviceToReplace || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> RESOLUTION DATE </label>
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData?.solvingWays?.[0]?.createdAt || 'N/A'}
                  </span>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> ALLOCATED TO </label>

                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card elevation={0} style={{ color: 'black', backgroundColor: 'white', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', height: '50px' }}>
                  <label> INCIDENT STATUS </label>
                  
                  <span style={{ display: 'block', marginTop: '0px', marginLeft: '2px' }}>
                    {incidentData.status || 'N/A'}
                  </span> 
                  
                </Card>
              </Grid>



            </Grid>
          </Box>
        )}
      </Container>

               <ChangeIncidentStatusDialog
                    open={isStatusOfIncidentDialogOpen}
                    onClose={() => setIsStatusOfIncidentDialogOpen(false)}
                    incidentId={incidentData ? incidentData.id : null}
                    loadIncidentDetails={loadIncidentDetails}
                    incidentData={incidentData}
                />
    </Box>

    
  );
};

export default ReportForm;
