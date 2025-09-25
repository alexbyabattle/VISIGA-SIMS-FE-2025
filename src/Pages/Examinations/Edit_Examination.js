import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme, Grid } from '@mui/material';
import { Formik } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useExaminationService from '../../api/services/examinationService';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ExaminationSchema } from '../../schemas/Schemas';

const EditDialog = ({ examinationId, open, onClose, onSuccess }) => {
  const [initialData, setInitialData] = useState(null);
  const { loadExaminationDetails, updateExaminationDetails } = useExaminationService();

  useEffect(() => {
    const fetchExaminationData = async () => {
      try {
        const examination = await loadExaminationDetails(examinationId);
        setInitialData({
          examinationName: examination.examinationName || '',
          examMarks: examination.examMarks || '',
          createdAt: dayjs(examination.createdAt) || dayjs(),
        });
      } catch (err) {
        console.error('Failed to load examination data:', err);
      }
    };

    if (open && examinationId) {
      fetchExaminationData();
    }
  }, [open, examinationId]);

  const handleSave = async (values) => {
    try {
      const payload = {
        id: examinationId,
        examinationName: values.examinationName,
        examMarks: values.examMarks,
        createdAt: values.createdAt.toISOString(),
      };
      await updateExaminationDetails( payload);
      onSuccess();
      onClose();
    } catch (error) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>EDIT EXAMINATION</DialogTitle>
      <DialogContent>
        {initialData && (
          <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={ExaminationSchema}
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
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Examination Name"
                      name="examinationName"
                      value={values.examinationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.examinationName && !!errors.examinationName}
                      helperText={touched.examinationName && errors.examinationName}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Examination Marks"
                      name="examMarks"
                      value={values.examMarks}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.examMarks && !!errors.examMarks}
                      helperText={touched.examMarks && errors.examMarks}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Creation Date"
                        value={values.createdAt}
                        onChange={(newValue) => setFieldValue('createdAt', newValue)}
                        disableFuture
                        slotProps={{
                          textField: {
                            variant: 'filled',
                            fullWidth: true,
                            error: !!touched.createdAt && !!errors.createdAt,
                            helperText: touched.createdAt && errors.createdAt,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <DialogActions sx={{ mt: 2 }}>
                  <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                  </Button>
                  <Button type="submit" color="secondary" variant="contained">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
