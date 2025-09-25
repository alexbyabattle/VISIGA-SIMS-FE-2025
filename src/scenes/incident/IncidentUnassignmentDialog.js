import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  MenuItem,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';


const initialValues = {
  selectedUsers: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function UnassignDialog({ open, onClose, loadIncidentDetails, incidentId }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const selectedIncidents = [incidentId];

  const handleIncidentAssignment = async (values) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const postData = {
        incidentIds: selectedIncidents,
        userIds: values.selectedUsers,
      };

      // console.log('Selected User IDs:', postData.userIds);
      // console.log('Selected Incident IDs:', postData.incidentIds);

      const response = await axios.post('http://localhost:8082/api/incident/unassign', postData, config);

      if (response.status === 200) {
        const responseStatus = response.data.header.responseStatus;

        // Show success snackbar
        setSnackbar({
          open: true,
          message: responseStatus,
          severity: 'success',
        });

        setSelectTouched(false);
        onClose();
        loadIncidentDetails();
      } else {
        // Show error snackbar
        setSnackbar({
          open: true,
          message: response.data.header.responseStatus,
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred. Please try again.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('Access token not found in local storage');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get('http://localhost:8082/api/v1/users/all', config);
        const filteredUsers = response.data.data.filter(user => user.department === 'IT' && user.role === 'ADMIN');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>ASSIGN INCIDENT TO PARTICULAR ADMIN</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            onSubmit={handleIncidentAssignment}
          >
            {({ values, handleChange }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      variant="filled"
                      label="IT ASSIGNED TASK"
                      onBlur={() => setSelectTouched(true)}
                      onChange={(e) => {
                        const selectedIds = e.target.value;
                        setSelectedUsers(selectedIds);
                        handleChange(e);
                      }}
                      value={values.selectedUsers}
                      name="selectedUsers"
                      helperText={
                        selectTouched && values.selectedUsers.length === 0 && 'At least one user must be selected'
                      }
                      SelectProps={{
                        multiple: true,
                        renderValue: (selected) =>
                          selected
                            .map((selectedUser) => {
                              const user = users.find((user) => user.id === selectedUser);
                              return user ? user.name : '';
                            })
                            .join(', '),
                      }}
                    >
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={6}>
                      <DateTimePicker
                        value={values.dateTime}
                        onChange={(newValue) =>
                          handleChange({
                            target: { name: 'dateTime', value: newValue },
                          })
                        }
                        disableFuture
                        views={['year', 'month', 'day', 'hours', 'minutes']}
                      />
                    </Grid>
                  </LocalizationProvider>
                </Grid>

                <DialogActions>
                  <Button type="submit" variant="contained" color="secondary">
                    Submit
                  </Button>
                  <Button onClick={onClose} color="secondary">
                    Cancel
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
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

export default UnassignDialog;
