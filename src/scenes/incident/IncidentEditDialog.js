import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const checkoutSchema = yup.object().shape({
  incidentTitle: yup.string().required('Required incident title'),
  dateTime: yup.date().required('Date and time is required')
});

const EditDialog = ({ id, open, onClose , loadIncidents }) => {

  const [selectTouched, setSelectTouched] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [editedData, setEditedData] = useState({});

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  

  const fetchIncidentData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8082/api/isw/getIswWithIncidents/${id}`);
      const incidentData = response.data.data;
      setEditedData(incidentData);
    } catch (error) {
      console.error('Error fetching incident data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };

  const handleSave = async (values) => {
    try {
      const response = await axios.put(`http://localhost:8082/api/incident/${id}`, values);
      const updatedData = response.data;
      if (response.status === 200) {

        setSnackbar({
          open: true,
          message: "selected incident is successfully edited",
          severity: 'success',
        });
        setEditedData(updatedData);
        loadIsws();
        onClose();

      } else {
        setSnackbar({
          open: true,
          message: "failed to edit the selected incident",
          severity: 'error',
        });
        onClose();
        console.error('Error: Something went wrong with the API request');
      }
      
      
    } catch (error) {
      console.error('Error updating isw data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };  


  useEffect(() => {
    fetchIncidentData(id);
  }, [id]);  
  

  {/* const handleSave = async (values) => {
    try {
      // Exclude 'id' property if it's null
      const requestData = values.id ? values : { iswName: values.iswName, incidents: values.incidents };
  
      const response = await axios.put(`http://localhost:8082/api/isw/${id}`, requestData);
      const updatedData = response.data;
      setEditedData(updatedData);
      onClose();
    } catch (error) {
      console.error('Error updating isw data:', error);
    }
  };  */}
  

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit incident solving way information</DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            
            incidentTitle: editedData.incidentTitle || '',
            incidentType: editedData.incidentType || '',
            dateTime: dayjs(),
          }}
          onSubmit={(values) => handleSave(values)}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="incident title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentTitle}
                    name="incidentTitle"
                    error={touched.incidentTitle && !!errors.incidentTitle}
                    helperText={touched.incidentTitle && errors.incidentTitle}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="incident type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.incidentType}
                    name="incidentType"
                    error={touched.incidentType && !!errors.incidentType}
                    helperText={touched.incidentType && errors.incidentType}
                  />
                </Grid>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) => handleChange('dateTime')(newValue)}
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                      name="dateTime"
                      error={touched.dateTime && !!errors.dateTime}
                      helperText={touched.dateTime && errors.dateTime}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="secondary" variant="contained">
                  Submit
                </Button>
              </DialogActions>
            </form>
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

export default EditDialog;
     