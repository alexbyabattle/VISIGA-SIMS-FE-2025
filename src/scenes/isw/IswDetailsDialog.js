import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Paper,
  Typography,
  
} from '@mui/material';

const IswDetailsDialog = ({ id, open, onClose }) => {
  const [iswData, setIswData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8082/api/isw/getIswWithIncidents/${id}`)
        .then((response) => {
          const { data } = response.data;
          setIswData(data);
        })
        .catch((error) => {
          console.error('Error fetching isw details:', error);
        });
    }
  }, [id]);
  

  return (
    
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>INCIDENT SOLVING WAY DETAILS</DialogTitle>
      <DialogContent>
        {iswData ? (
          <div>
            <Paper elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>
              
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                  <strong>Incident Solving  way:</strong> {iswData.iswName}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                  <strong  style={{ marginRight: '15px' }} >Incident Causes:</strong>{iswData.incidentCausedBy}    
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                   <strong  style={{ marginRight: '15px' }} >Device to  replace:</strong>{iswData.deviceToReplace}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                  <strong  style={{ marginRight: '15px' }} >Incident Status:</strong>{iswData.incidentStatus}
              </Typography>
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                  <strong  style={{ marginRight: '15px' }} >Solved At:</strong>{iswData.createdAt}
              </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: '10px', marginBottom: '8px' }}>
              <strong style={{ marginLeft: '4px' }}>Incidents:</strong>
              <ul>
                {iswData.incidents
                  ? iswData.incidents.map((incident, index) => (
                      <li key={incident.id}>
                        <Typography variant="body1">
                          <strong style={{ marginRight: '15px' }} >Incident Title:</strong> {incident.incidentTitle}
                        </Typography>
                        <Typography variant="body1">
                          <strong  style={{ marginRight: '15px' }} >Incident Type:</strong> {incident.incidentType}
                        </Typography>
                        <Typography variant="body1">
                          <strong  style={{ marginRight: '15px' }} >priority:</strong> {incident.priority}
                        </Typography>
                        <Typography variant="body1">
                          <strong  style={{ marginRight: '15px' }} >CreatedAt:</strong> {incident.createdAt}
                        </Typography>
                        
                      </li>
                    ))
                  : null}
              </ul>
            </Paper>
          </div>
        ) : (
          <DialogContentText>Loading incident solving way details...</DialogContentText>
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

export default IswDetailsDialog;
