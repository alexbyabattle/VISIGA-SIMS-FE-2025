import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  CircularProgress,
  Typography,
  Container
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { Category } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import image from '../../data/image';


const initialValues = {
  incidentTitle: '',
  incidentType: '',
  devices: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  incidentTitle: yup.string().required('Required incidentTitle'),
  incidentType: yup.string().required('required incident type'),
  devices: yup
    .array()
    .min(1, 'At least one incident must be selected')
    .required('At least one incident must be selected'),
});

const IncidentPage = () => {
  const [devices, setDevices] = useState([]);
  const [selectTouched, setSelectTouched] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseCode, setResponseCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const circularProgressColor = theme.palette.mode === 'dark' ? 'white' : 'black';
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

  const handleClassify = async (values) => {
    try {
      setLoading(true);

      const userId = userDetails?.id;
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken || !userId) {
        console.error('Access token or user ID not found in local storage');
        return;
      }

      const postData = {
        incidentTitle: values.incidentTitle,
        incidentType: values.incidentType,
        devices: values.devices.map((deviceId) => ({ id: deviceId })),
        users: [{ id: userId }],
        Category: '',
        
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const classifyResponse = await axios.post(
        'http://127.0.0.1:5000/classify/incidents',
        {
          text: values.incidentTitle,
        }
      );

      postData.category =
        classifyResponse.data.prediction === 'NOT NETWORK'
          ? 'NOT_NETWORK'
          : 'NETWORK';

      const saveResponse = await axios.post(
        'http://localhost:8082/api/incident/create',
        postData,
        config
      );

      setResponseStatus(saveResponse.data.header.responseStatus);
      setResponseCode(saveResponse.data.header.responseCode);
      formik.resetForm();

      navigate('/incidents');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: handleClassify,
  });

  
  

  useEffect(() => {
    // Fetch devices from API
    const getDevices = async () => {
      try {
        const userId = userDetails?.id;
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken || !userId) {
          console.error('Access token or user ID not found in local storage');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.get(
          `http://localhost:8082/api/v1/device/user/${userId}`,
          config
        );

        if (response.data && response.data.data) {
          setDevices(response.data.data);
        } else {
          console.error('Invalid response structure:', response.data);
        }


      } catch (error) {
        console.error('Error fetching devices:', error);

      }
    };

    getDevices();
  }, []);

  return (
    <Container maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <Box
          component="div"
          sx={{ mt: 3, border: `1px solid ${borderColor}`, p: 3 }}
        >
          <Box
            height="100px"
            sx={{
              padding: 0,
              border: `1px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              
              marginBottom: '20px',
            }}
          >
            
            <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 0, overflow: 'hidden' }}>
              <img
                alt="gcla admin"
                width="100%"
                height="100px"
                src={image.george}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
            <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center"> <h2>INCIDENT REPORTING FORM</h2></Typography>
            </Box>
            <Box sx={{ flex: 1, borderRight: `1px solid ${borderColor}`, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5" align="center">ICT AND STATISTICS OFFICE</Typography>
            </Box>
            
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="incident Title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.incidentTitle}
                name="incidentTitle"
                error={
                  !!formik.touched.incidentTitle &&
                  !!formik.errors.incidentTitle
                }
                helperText={
                  formik.touched.incidentTitle &&
                  formik.errors.incidentTitle
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                select
                fullWidth
                variant="filled"
                label="Incident Type"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.incidentType}
                name="incidentType"
                error={
                  !!formik.touched.incidentType &&
                  !!formik.errors.incidentType
                }
                helperText={
                  formik.touched.incidentType && formik.errors.incidentType
                }
              >
                <MenuItem value="SOFTWARE">SOFTWARE</MenuItem>
                <MenuItem value="HARDWARE">HARDWARE</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                select
                fullWidth
                variant="filled"
                label="Devices"
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setSelectTouched(true);
                }}
                onChange={formik.handleChange}
                value={formik.values.devices}
                name="devices"
                error={
                  !!(selectTouched && !!formik.errors.devices)
                }
                helperText={selectTouched && formik.errors.devices}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    return selected
                      .map((selectedDeviceId) => {
                        const device = devices.find(
                          (device) => device.id === selectedDeviceId
                        );
                        return device ? device.deviceName : '';
                      })
                      .join(', ');
                  },
                }}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.deviceName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <div style={{ marginTop: '10px' }} />
                <DateTimePicker
                  value={formik.values.dateTime}
                  onChange={(newValue) =>
                    formik.setFieldValue('dateTime', newValue)
                  }
                  disableFuture
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                />
              </Grid>
            </LocalizationProvider>
          </Grid>

          <div style={{ marginTop: '20px' }}>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              style={{ padding: '10px 20px', fontSize: '16px' }}
              disabled={loading}
            >
              Submit
            </Button>
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {loading && <CircularProgress size={100} style={{ color: circularProgressColor, marginLeft: 10 }} />}
          </Box>

          {/* Response status */}
          {responseStatus && (
            <div
              style={{
                display: 'inline-block',
                padding: '1px 1px',
                borderRadius: '1px',
                backgroundColor:
                  responseCode === '0'
                    ? 'success'
                    : responseCode === '1'
                      ? 'error'
                      : 'transparent',
                borderColor:
                  responseCode === '0'
                    ? 'success'
                    : responseCode === '1'
                      ? 'error'
                      : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: 'white',
              }}
            >
              <p>{responseStatus}</p>
            </div>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default IncidentPage;
