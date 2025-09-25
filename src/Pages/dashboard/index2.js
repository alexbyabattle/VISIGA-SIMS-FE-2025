import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [responseMessage, setResponseMessage] = useState('');
  const [location, setLocation] = useState('');
  const [sameLocationIncidents, setSameLocationIncidents] = useState([]);
  const [referenceLocation, setReferenceLocation] = useState('');

  


  const fetchIncidentData = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/incident/list');
      const data = response.data.data; // Access the data array directly

      // Log all retrieved incidents
      // console.log('All Retrieved Incidents:', data);

      if (data && data.length > 0) {
        // Get the createdAt time of the last incident in the array
        const lastIncident = data[data.length - 1];
        if (lastIncident && lastIncident.createdAt) {
          const lastCreatedAt = new Date(lastIncident.createdAt);
          // console.log('Last Incident Created At:', lastCreatedAt);

          // Calculate 30 minutes before lastCreatedAt
          const thirtyMinutesAgo = new Date(lastCreatedAt.getTime() - 30 * 60000);
          // console.log('Thirty minutes before Last Incident Created At:', thirtyMinutesAgo);

          // Filter incidents with category "NETWORK" and within the timeframe
          const filteredIncidents = data.filter(incident => {
            const incidentTime = new Date(incident.createdAt);

            // Check if incident falls between thirtyMinutesAgo and lastCreatedAt
            // AND has category "NETWORK"
            return (
              incidentTime >= thirtyMinutesAgo &&
              incidentTime <= lastCreatedAt &&
              incident.category === 'NETWORK' // Filter by category
            );
          });

          // console.log('Network incidents in the last 30 minutes:', filteredIncidents);

          // Get the reference location from the first incident in the filtered list
          const referenceLocation = filteredIncidents.length > 0 ? filteredIncidents[0].users[0]?.location : null;

          if (referenceLocation) {
            // Filter incidents to get only those with the same location
            const sameLocationIncidents = filteredIncidents.filter(incident => {
              return incident.users[0]?.location === referenceLocation;
            });

            // Update state with same location incidents and reference location
            setSameLocationIncidents(sameLocationIncidents);
            setReferenceLocation(referenceLocation);

            // Log the same location incidents and their count
            // console.log('Incidents with the same location:', sameLocationIncidents);
            // console.log('Number of incidents with the same location:', sameLocationIncidents.length);
            // console.log('Location of incidents:', referenceLocation);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching incident data:', error);
    }
  };



  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to GCLA IIRS dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="GCLA"
            subtitle="report incident"
            progress="1"
            increase="24hrs"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="GCLA"
            subtitle="request device"
            progress="1"
            increase="24hrs"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="GCLA"
            subtitle="confirm resolution"
            progress="1"
            increase="24hrs"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="GCLA"
            subtitle="device management"
            progress="1"
            increase="24hrs"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {userRole === 'ADMIN' || userRole === 'MANAGER' ? (
          <Box
            gridColumn="span 4"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="flex-start"
            justifyContent="flex-start"
            flexDirection="column"
            padding="5px"
            minHeight="200px"
          >
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              style={{ padding: '10px 20px', fontSize: '16px' }}
              onClick={fetchIncidentData}
              padding="1px"
            >
              Get High Priority Locations
            </Button>
            <Typography variant="h6" sx={{ mt: 2, fontSize: '18px' }}>
              Incidents from the same location caused by network issue are:&nbsp;{sameLocationIncidents.length}
            </Typography>
            {sameLocationIncidents.length >= 5 ? (
              <Box sx={{ mt: 2, backgroundColor: 'red', padding: '10px', borderRadius: '4px' }}>
                <Typography variant="h6" sx={{ fontSize: '18px', color: 'white' }}>
                  There is high priority at:&nbsp;{referenceLocation}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" sx={{ fontSize: '18px' }}>
                The incidents occur at:&nbsp;{referenceLocation}
              </Typography>
            )}
          </Box>
        ) : null}



      </Box>
    </Box>
  );
};

export default Dashboard;
