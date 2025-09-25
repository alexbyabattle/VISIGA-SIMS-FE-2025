import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { Formik, Form } from 'formik';
import useTeacherService from '../../api/services/teacherService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TeacherSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  createdAt: dayjs(),
};

const CreateDialog = ({ open, onClose, onSuccess }) => {
  const { createTeacher } = useTeacherService();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const teacherDto = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: 'TEACHER',
        createdAt: values.createdAt?.toISOString(),
      };

      await createTeacher(teacherDto, () => {
        onSuccess?.();
        onClose();
      });
    } catch (error) {
      toast.error('Failed to create teacher');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>CREATE TEACHER</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={TeacherSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phoneNumber}
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>

                <Grid item xs={12} lg={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Creation Date"
                      value={values.createdAt}
                      onChange={(newValue) => setFieldValue('createdAt', newValue)}
                      disableFuture
                    />
                  </LocalizationProvider>
                  {touched.createdAt && errors.createdAt && (
                    <div style={{ color: 'red', fontSize: '0.8rem' }}>
                      {errors.createdAt}
                    </div>
                  )}
                </Grid>
              </Grid>

              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
