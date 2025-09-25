import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import useTeacherService from '../../api/services/teacherService';
import { TeacherSchema } from '../../schemas/Schemas';


const initialValues = {
  selectedSubjects: [],
  dateTime: dayjs(),
};

function SubjectUnAssignmentDialog({ open, onClose, onSuccess, subjectId }) {
    
  const [selectTouched, setSelectTouched] = useState(false);
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  // ✅ Move hooks inside the component
  const { assignTeacherToSubject } = useSubjectService();
  const { fetchTeachers, teachers: fetchedTeachers } = useTeacherService();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    setTeachers(fetchedTeachers);
  }, [fetchedTeachers]);

  const handleAssignment = async () => {
  const teacherIds = selectedTeachers.map(teacher => teacher.id);

  try {
    await assignTeacherToSubject(subjectId, teacherIds);
    setSelectTouched(false);
    onSuccess?.();
    onClose();   
  } catch (error) {
    console.error("Assignment failed:", error);
  }
};


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ASSIGN TEACHER TO THE SUBJECT</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={TeacherSchema} onSubmit={handleAssignment}>
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={teachers}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setSelectedTeachers(newValue);
                      setSelectTouched(true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="TEACHER ASSIGNED SUBJECT"
                        variant="filled"
                        onBlur={() => {
                          setSelectTouched(true);
                        }}
                        helperText={
                          selectTouched && selectedTeachers.length === 0 && 'At least one teacher must be selected'
                        }
                      />
                    )}
                  />
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid item xs={6}>
                    <div style={{ marginTop: '10px' }} />
                    <DateTimePicker
                      value={values.dateTime}
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: 'dateTime', value: newValue },
                        })
                      }
                      disableFuture
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              <DialogActions>
                <Button type="submit" variant="contained" color="secondary">
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

export default SubjectUnAssignmentDialog;

