import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme, Grid, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useParentService from '../../api/services/ParentsService';
import { Autocomplete } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import { endpoints } from '../../api/endPoints';


const initialValues = {
  selectedStudents: [],
  dateTime: dayjs(),
};

const validationSchema = yup.object().shape({
  selectedStudents: yup.array().min(1, 'Select at least one student'),
  dateTime: yup.date().required('Date and time is required'),
});

function UnAssignmentDialog({ open, onClose, onSuccess, parentId }) {
  const [students, setStudents] = useState([]);
  const { unAssignStudentsFromParent } = useParentService();

  const fetchActiveStudents = async () => {
    try {
      const response = await axiosInstance.get(`${endpoints.students.All}?page=0&size=100&status=ACTIVE`);
      const { data } = response.data;
      const transformed = (data.data || []).map((student) => ({
        id: student.id,
        studentName: student.studentName,
        createdAt: student.createdAt,
      }));
      setStudents(transformed);
    } catch (error) {
      toast.error('Error fetching students.');
      console.error('Fetch Students Error:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchActiveStudents();
    }
  }, [open]);

  const handleUnAssignment = async (values) => {
    const studentIds = values.selectedStudents.map((student) => student.id);
    try {
      await unAssignStudentsFromParent(parentId, studentIds);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('unAssignment failed.');
      console.error('unAssignment Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>UNASSIGN STUDENTS FROM CLASS</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleUnAssignment}
        >
          {({ values, errors, touched, setFieldValue, handleBlur }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Student Selection */}
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={students}
                    getOptionLabel={(option) =>
                      `${option.studentName} - ${dayjs(option.createdAt).format('YYYY-MM-DD')}`
                    }
                    value={values.selectedStudents}
                    onChange={(event, newValue) => setFieldValue('selectedStudents', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select ACTIVE Students"
                        variant="filled"
                        onBlur={handleBlur}
                        error={touched.selectedStudents && Boolean(errors.selectedStudents)}
                        helperText={touched.selectedStudents && errors.selectedStudents}
                      />
                    )}
                  />
                </Grid>

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Assignment Date"
                      value={values.dateTime}
                      onChange={(newValue) => setFieldValue('dateTime', newValue)}
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
                          name="dateTime"
                          onBlur={handleBlur}
                          error={Boolean(errors.dateTime)}
                          helperText={errors.dateTime}
                        />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              <DialogActions>
                <Button type="submit" variant="contained" color="primary">
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
  );
}

export default UnAssignmentDialog;
