import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { Formik, Form } from 'formik';
import useSubjectService from '../../api/services/SubjectService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { SubjectSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';

const initialValues = {
  subjectName: '',
  createdAt: dayjs(),
};

const CreateDialog = ({ open, onClose, onSuccess }) => {
  const { createSubject } = useSubjectService();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const subjectDto = {
        subjectName: values.subjectName,
        // remove createdAt first to test
        // createdAt: values.createdAt?.toISOString(),
      };
  
      // Call createSubject with a success callback
      await createSubject(subjectDto, () => {
        onSuccess?.();
        onClose();
      });
  
    } catch (error) {
      console.error("Create subject failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create subject');
    } finally {
      setSubmitting(false);
    }
  };
  
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>CREATE SUBJECT</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        <Formik
          initialValues={initialValues}
          validationSchema={SubjectSchema}
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
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject Name"
                    name="subjectName"
                    variant="filled"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.subjectName}
                    error={touched.subjectName && Boolean(errors.subjectName)}
                    helperText={touched.subjectName && errors.subjectName}
                  />
                </Grid>

                <Grid item xs={12}>
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
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
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
