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
  Avatar,
  CircularProgress
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
import { toast } from 'react-hot-toast';

const initialValues = {
  selectedSubjects: [],
  dateTime: dayjs(),
};

function SubjectAssignmentDialog({ open, onClose, onSuccess, subjectId, clazzId }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { assignTeacherToSubject } = useSubjectService();
  const { fetchTeachers, teachers: fetchedTeachers } = useTeacherService();

  useEffect(() => {
    fetchTeachers(0, 300, 'ACTIVE');
  }, []);

  useEffect(() => {
    setTeachers(fetchedTeachers);
  }, [fetchedTeachers]);

  const handleAssignment = async () => {
    if (selectedTeachers.length === 0) {
      toast.error('Please select at least one teacher');
      return;
    }

    setIsSubmitting(true);
    const teacherIds = selectedTeachers.map(teacher => teacher.id);

    try {
      await assignTeacherToSubject(subjectId, teacherIds, clazzId);
      toast.success('Teachers successfully assigned to the subject!');
      setSelectTouched(false);
      setSelectedTeachers([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Assignment failed:", error);
      toast.error(error.response?.data?.message || 'Failed to assign teachers to subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ASSIGN TEACHER TO THE SUBJECT</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
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
        <Formik initialValues={initialValues} validationSchema={SelectedTeacherSchema}>
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
                    disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>

              <DialogActions>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleAssignment}
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Assigning...' : 'Submit'}
                </Button>

                <Button 
                  onClick={onClose} 
                  color="secondary"
                  disabled={isSubmitting}
                >
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
