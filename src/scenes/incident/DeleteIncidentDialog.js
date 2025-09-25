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

function DeleteDialog({ open, onClose, incidentId }) {

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const deleteItem = () => {
    // Define the API endpoint for deleting the item
    const deleteData = `http://localhost:8082/api/incident/delete/${incidentId}`;

    // Make an HTTP DELETE request to delete the item
    axios
      .delete(deleteData)
      .then((response) => {

        if (response.status === 200) {

          setSnackbar({
            open: true,
            message: "selected incident is successfully deleted",
            severity: 'success',
          });

          onClose();

        } else {
          setSnackbar({
            open: true,
            message: "failed to delete the selected incident",
            severity: 'error',
          });
          onClose();
          console.error('Error: Something went wrong with the API request');
        }
      })
      .catch((error) => {

        console.error('repsonse data', error.response?.data);

      });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogContent style={dialogContentStyle}>
          <Typography variant="body1">
            Do you want to delete the specified data?
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Box display="flex" justifyContent="center" mt="20px">
            <Button onClick={deleteItem} color="error" variant="contained">
              Delete
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

export default DeleteDialog;
