import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Container,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import image from '../../data/image';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const initialValues = {
  incidentTitle: '',
  incidentType: '',
  deviceName: '',
  quantityOfItem: '',
  users: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  incidentTitle: yup.string().required('Required description of your request'),
  incidentType: yup.string().required('Required your request type'),
  deviceName: yup.string().required('Item requested is required'),
  quantityOfItem: yup.string().required('Number of items requested is required'),
});

const Request = () => {
  const [selectTouched, setSelectTouched] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseCode, setResponseCode] = useState(null);

  const theme = useTheme();
  const borderColor = theme.palette.mode === 'dark' ? 'white' : 'black';

  const navigate = useNavigate();

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

  const handleFormSubmit = async (values) => {
    try {
      const userId = userDetails?.id;
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken || !userId) {
        console.error('Access token or user ID not found in local storage');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const formattedData = {
        incidentTitle: values.incidentTitle,
        incidentType: values.incidentType,
        deviceName: values.deviceName,
        createdAt: dayjs(),
        quantityOfItem: values.quantityOfItem,
        users: [{ id: userId }],
      };

      const response = await axios.post('http://localhost:8082/api/incident/request', formattedData, config);

      // console.log(response.data);

      setResponseStatus(response.data.header.responseStatus);
      setResponseCode(response.data.header.responseCode);

      formik.resetForm();

      navigate('/viewRequest');
    } catch (error) {
      // Handle the error
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Container maxWidth="md" sx={{ padding: { xs: 2, sm: 3  } }}>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 3, border: `1px solid ${borderColor}`, p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mb: 2,
              border: `1px solid ${borderColor}`,
              height: '150px'
            }}
          >
            <Box sx={{ flex: 1, p: 0, overflow: 'hidden' }}>
              <img
                alt="gcla admin"
                width="100%"
                height="100px"
                src={image.george}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            <Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center">
                <h2>REQUISITION FORM</h2>
              </Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center">ICT AND STATISTICS OFFICE</Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                variant="filled"
                label="REQUEST TYPE"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.incidentType}
                name="incidentType"
                error={!!formik.touched.incidentType && !!formik.errors.incidentType}
                helperText={formik.touched.incidentType && formik.errors.incidentType}
              >
                <MenuItem value="REQUEST">REQUEST</MenuItem>
                <MenuItem value="LENDING">LENDING</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ITEM"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.deviceName}
                name="deviceName"
                error={!!formik.touched.deviceName && !!formik.errors.deviceName}
                helperText={formik.touched.deviceName && formik.errors.deviceName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="QUANTITY OF ITEM"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.quantityOfItem}
                name="quantityOfItem"
                error={!!formik.touched.quantityOfItem && !!formik.errors.quantityOfItem}
                helperText={formik.touched.quantityOfItem && formik.errors.quantityOfItem}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="REQUEST DESCRIPTION"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.incidentTitle}
                name="incidentTitle"
                error={!!formik.touched.incidentTitle && !!formik.errors.incidentTitle}
                helperText={formik.touched.incidentTitle && formik.errors.incidentTitle}
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12}>
                <DateTimePicker
                  value={formik.values.dateTime}
                  onChange={(newValue) =>
                    formik.setFieldValue('dateTime', newValue)
                  }
                  disableFuture
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                  renderInput={(params) => <TextField fullWidth {...params} variant="filled" />}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              sx={{ padding: '10px 20px', fontSize: '16px' }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        {responseStatus && (
          <Box
            sx={{
              mt: 2,
              padding: '1px',
              borderRadius: '1px',
              backgroundColor: responseCode === '0' ? 'success.main' : responseCode === '1' ? 'error.main' : 'transparent',
              borderColor: responseCode === '0' ? 'success.main' : responseCode === '1' ? 'error.main' : 'transparent',
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'white',
              display: 'inline-block',
            }}
          >
            <Typography>{responseStatus}</Typography>
          </Box>
        )}
      </form>
    </Container>
  );
};

export default Request;
