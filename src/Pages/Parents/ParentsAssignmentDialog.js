import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  useTheme, 
  Grid, 
  CircularProgress 
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useParentService from '../../api/services/ParentsService';
import useStudentService from '../../api/services/studentService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import { Autocomplete } from '@mui/material';
import * as yup from 'yup';

const initialValues = {
  selectedStudents: [],
  dateTime: dayjs()
};

const validationSchema = yup.object().shape({
  selectedStudents: yup.array().min(1, 'At least one student must be selected'),
  dateTime: yup.date().required('Assignment date is required')
});

function AssignmentDialog({ open, onClose, onSuccess, parentId }) {
  const [students, setStudents] = useState([]);
  const { assignStudentsToParent } = useParentService();
  const { fetchActiveStudents } = useStudentService();

  useEffect(() => {
    const loadStudents = async () => {
      const activeStudents = await fetchActiveStudents();
      setStudents(activeStudents);
    };
    loadStudents();
  }, []);

  const handleAssignment = async (values) => {
    const studentIds = values.selectedStudents.map((student) => student.id);

    try {
      await assignStudentsToParent(parentId, studentIds); // Send array of UUIDs
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ASSIGN STUDENTS TO PARENT</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAssignment}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={students}
                    getOptionLabel={(option) => `${option.studentName} - ${dayjs(option.createdAt).format('YYYY-MM-DD')}`}
                    value={values.selectedStudents}
                    onChange={(event, newValue) => setFieldValue('selectedStudents', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select ACTIVE Students"
                        variant="filled"
                        error={touched.selectedStudents && Boolean(errors.selectedStudents)}
                        helperText={touched.selectedStudents && errors.selectedStudents}
                      />
                    )}
                  />
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Assignment Date"
                      value={values.dateTime}
                      onChange={(newValue) => setFieldValue('dateTime', newValue)}
                      disableFuture
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="filled"
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

export default AssignmentDialog;
