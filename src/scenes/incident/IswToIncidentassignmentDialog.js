import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState  } from 'react';
import axios from 'axios';
import { Formik , Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


const initialValues = {
  iswName: '',
  incidentCausedBy: '',
  deviceToReplace: '',
  incidentStatus: '',
  selectedIncidents: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({

  iswName: yup.string().required('Required incident solving way'),
  incidentCausedBy : yup.string().required('required  incident Caused By '),
  deviceToReplace : yup.string().required('required  deviceToReplace '),
  incidentStatus : yup.string().required('required  incidentStatus '),
  selectedIncidents: yup.array(),
  dateTime: yup.date().required('Date and time are required'),

});

function  IswToIncident({ open, onClose, loadIncidentDetails , incidentId }) {

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
      };

  const [selectTouched, setSelectTouched] = useState(false);
  
  const selectedIncidents = [incidentId];

  const handleFormSubmit = async (values) => {
    try {

      const postData = {
        iswName: values.iswName,
        incidentCausedBy: values.incidentCausedBy,
        deviceToReplace: values.deviceToReplace,
        incidentStatus: values.incidentStatus,
        incidents: selectedIncidents.map((id) => ({ id })),
        dateTime: values.dateTime,
      };

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
  
      // console.log('Posting data:', postData); // Log the data being posted
  
      const response = await axios.post('http://localhost:8082/api/isw/create', postData , config );
  
      
  
      if (response.status === 200) {
        
        setSnackbar({
          open: true,
          message: " Incident solving  details saved",
          severity: 'success',
        });

        loadIncidentDetails();
        onClose();
        setSelectTouched(false);
      } else {

        setSnackbar({
          open: true,
          message: "failed to save incident solving ways  ",
          severity: 'error',
        });
        
        console.error('Error: Something went wrong with the API request');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle> Add Incident Solving  Way</DialogTitle>
      <DialogContent>
        <DialogContentText> </DialogContentText>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange }) => (
            <Form>
              <Grid container spacing={2}>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Solving Way"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.iswName}
                    name="iswName"
                    error={touched.iswName && !!errors.iswName}
                    helperText={touched.iswName && errors.iswName}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Incident  caused By "
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentCausedBy}
                    name="incidentCausedBy"
                    error={touched.incidentCausedBy && !!errors.incidentCausedBy}
                    helperText={touched.incidentCausedBy && errors.incidentCausedBy}
                  />
                </Grid>


                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="required devide to replace "
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.deviceToReplace}
                    name="deviceToReplace"
                    error={touched.deviceToReplace && !!errors.deviceToReplace}
                    helperText={touched.deviceToReplace && errors.deviceToReplace}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="incident Status "
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentStatus}
                    name="incidentStatus"
                    error={touched.incidentStatus && !!errors.incidentStatus}
                    helperText={touched.incidentStatus && errors.incidentStatus}
                  />
                </Grid>

                

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={6}>
                <div style={{ marginTop: '10px' }} />
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
};

export default IswToIncident;
