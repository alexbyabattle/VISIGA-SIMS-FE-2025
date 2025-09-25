import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme, Grid, CircularProgress, Typography } from '@mui/material';
import { Formik } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useTeacherService from '../../api/services/teacherService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TeacherSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';

const EditDialog = ({ teacherId, open, onClose, onSuccess }) => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loadTeacherDetails, updateTeacherDetails } = useTeacherService();

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      setIsLoading(true);
      try {
        const teacher = await loadTeacherDetails(teacherId);
        setInitialData({
          id: teacher.id,
          name: teacher.name || '',
          email: teacher.email || '',
          phoneNumber: teacher.phoneNumber || '',
          dateTime: dayjs(), // Optional field
        });
      } catch (err) {
        console.error('Failed to load teacher data:', err);
        toast.error('Failed to load teacher details');
      } finally {
        setIsLoading(false);
      }
    };

    if (open && teacherId) {
      fetchTeacherData();
    } else {
      setInitialData(null);
    }
  }, [open, teacherId]);

  const handleSave = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: values.id,
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
      };

      await updateTeacherDetails(payload);
      toast.success("Teacher updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to update teacher');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>EDIT TEACHER</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : initialData ? (
          <Formik
            enableReinitialize
            initialValues={initialData}
            // validationSchema={TeacherSchema}
            onSubmit={handleSave}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting: formikSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                {isSubmitting && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Teacher Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.name && !!errors.name}
                      helperText={touched.name && errors.name}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Phone Number"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.phoneNumber && !!errors.phoneNumber}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="email"
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Timestamp (optional)"
                        value={values.dateTime}
                        onChange={(newValue) => setFieldValue('dateTime', newValue)}
                        disableFuture
                        disabled={isSubmitting}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button 
                    onClick={onClose} 
                    color="secondary" 
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="secondary" 
                    variant="contained"
                    disabled={isSubmitting || formikSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>No teacher data available</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
