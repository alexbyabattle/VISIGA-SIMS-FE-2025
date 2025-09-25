import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme } from '@mui/material';
import { Formik, Form } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useClassService from '../../api/services/ClassService';
import { toast } from 'react-hot-toast';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Grid, CircularProgress } from '@mui/material';
import * as yup from 'yup';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import useSubjectService from '../../api/services/SubjectService';


const initialValues = {
  selectedSubjects: [],
  dateTime: dayjs(),
};

const checkoutSchema = yup.object().shape({
  selectedUsers: yup.array(),
  dateTime: yup.date().required('Date and time is required'),
});

function UnassignmentDialog({ open, onClose, onSuccess, clazzId }) {
  const [selectTouched, setSelectTouched] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false); 

  const { unAssignSubjectsFromClass } = useClassService();
  const { fetchSubjects, subjects: fetchedSubjects } = useSubjectService();

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    setSubjects(fetchedSubjects);
  }, [fetchedSubjects]);

  const handleAssignment = async () => {
    const subjectIds = selectedSubjects.map(subject => subject.id);
    setLoading(true); 

    try {
      await unAssignSubjectsFromClass(clazzId, subjectIds);
      setSelectTouched(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Unassignment failed:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>UNASSIGN SUBJECT FROM THE CLASS</DialogTitle>
      <DialogContent>
        <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleAssignment}>
          {({ values, errors, touched, handleBlur, handleChange, setFieldTouched }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    multiple
                    options={subjects}
                    getOptionLabel={(option) => option.subjectName}
                    onChange={(event, newValue) => {
                      setSelectedSubjects(newValue);
                      setSelectTouched(true);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="CLASS ASSIGNED SUBJECTS"
                        variant="filled"
                        onBlur={() => {
                          setSelectTouched(true);
                        }}
                        helperText={
                          selectTouched && selectedSubjects.length === 0 && 'At least one subject must be selected'
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
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="primary" />}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
                <Button onClick={onClose} color="secondary" disabled={loading}>
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

export default UnassignmentDialog;
