import React , {useState} from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Alert,
  Snackbar,
  
} from '@mui/material';


const dialogContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80px',
};

function DeleteDialog({ open, onClose, iswId, showSnackbar }) {

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

  const deleteItem = () => {
    
    const deleteData = `http://localhost:8082/api/isw/delete/${iswId}`;

    // Make an HTTP DELETE request to delete the item
    axios
      .delete(deleteData)
      .then((response) => {
        if (response.status === 200) {

          setSnackbar({
            open: true,
            message: "selected solving way is successfully deleted",
            severity: 'success',
          });

          onClose();

        } else {
          setSnackbar({
            open: true,
            message: "failed to delete the selected  solving way",
            severity: 'error',
          });
          onClose();
          console.error('Error: Something went wrong with the API request');
        }
        onClose();
      })
      .catch((error) => {
        // Handle any errors (e.g., show an error message)
        console.error('Error deleting item:', error);

        // Close the dialog
        onClose();
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
