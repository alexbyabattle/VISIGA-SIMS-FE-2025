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
  Snackbar,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import useSubjectService from '../../api/services/SubjectService';
import useTeacherService from '../../api/services/teacherService';
import * as image from '../../assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from "../../components/Header";
import { SelectedTeacherSchema } from '../../schemas/Schemas';
import { tokens } from '../../theme';
import { useNavigate, useParams } from "react-router-dom";

const initialValues = {
  selectedSubjects: [],
  dateTime: dayjs(),
};

function SubjectAssignmentDialog({ open, onClose, onSuccess, subjectId , clazzId }) {

  const [selectTouched, setSelectTouched] = useState(false);
  const [teachers, setTeachers] = useState([])
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const { assignTeacherToSubject } = useSubjectService();
  const { fetchTeachers, teachers: fetchedTeachers } = useTeacherService();

  useEffect(() => {
    fetchTeachers(0, 300, 'ACTIVE');
  }, []);


  useEffect(() => {
    setTeachers(fetchedTeachers);
  }, [fetchedTeachers]);

  const handleAssignment = async () => {

    const teacherIds = selectedTeachers.map(teacher => teacher.id);
    // console.log("teacher ids are" , teacherIds);

    try {
      await assignTeacherToSubject(subjectId, teacherIds , clazzId);
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
        <Formik initialValues={initialValues} validationSchema={SelectedTeacherSchema} >
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={teachers}
                    getOptionLabel={(option) => option.name}
                    getOptionKey={(option) => option.id}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
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
                <Button variant="contained" color="secondary" onClick={handleAssignment}>
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

export default SubjectAssignmentDialog;

