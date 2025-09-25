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
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const checkoutSchema = yup.object().shape({
    incidentTitle: yup.string().required('Required incidentTitle '),
    incidentType: yup.string().required('required incident type'),
    deviceName: yup.string().required('required device Name'),
    quantityOfItem: yup.string().required('required quantity of  item'),
});

const EditRequestDetailsDialog = ({ id, open, onClose , loadIncidents }) => {
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    // console.log('ID passed to EditRequestDetailsDialog:', id);
    fetchIncidentData(id);
  }, [id]);

 

  const fetchIncidentData = async (id) => {
    try {

      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken ) {
        console.error('Access token not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.get(`http://localhost:8082/api/incident/request/${id}` , config);
      const incidentData = response.data;
      // console.log('Incident Data:', incidentData); 
      setEditedData(incidentData);
      
    } catch (error) {
      console.error('Error fetching isw data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };

  const handleSave = async (values) => {
    try {
      const response = await axios.put(`http://localhost:8082/api/incident/${id}`, values);
      const updatedData = response.data;
      setEditedData(updatedData);
      loadIncidents();
      onClose();
    } catch (error) {
      console.error('Error updating request data:', error);
      console.error('Response Data:', error.response?.data);
    }
  };  

  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle> EDIT  REQUEST </DialogTitle>
      <DialogContent>
        <Formik
          enableReinitialize
          initialValues={{
            incidentTitle: editedData.incidentTitle || '',
            incidentType: editedData.incidentType || '',
            deviceName: editedData.deviceName || '',
            quantityOfItem: editedData.quantityOfItem || '',
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
              label="REQUEST-TYPE "
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.incidentType}
              name="incidentType"
              error={!!touched.incidentType && !!errors.incidentType}
              helperText={touched.incidentType && errors.incidentType}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="ITEM NAME"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.deviceName}
              name="deviceName"
              error={!!touched.deviceName && !!errors.deviceName}
              helperText={touched.deviceName && errors.deviceName}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="QUANTITY OF ITEM"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.quantityOfItem}
              name="quantityOfItem"
              error={!!touched.quantityOfItem && !!errors.quantityOfItem}
              helperText={touched.quantityOfItem && errors.quantityOfItem}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="DESCRIPTION OF REQUEST"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.incidentTitle}
              name="incidentTitle"
              error={!!touched.incidentTitle && !!errors.incidentTitle}
              helperText={touched.incidentTitle && errors.incidentTitle}
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
  );
};

export default EditRequestDetailsDialog;
     