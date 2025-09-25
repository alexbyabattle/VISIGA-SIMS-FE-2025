import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, useTheme, Grid, Autocomplete } from '@mui/material';
import { Formik, Field } from 'formik';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import useClassService from '../../api/services/ClassService';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ClassSchema } from '../../schemas/classSchema';


const EditDialog = ({ classId, open, onClose, onSuccess }) => {
  const [initialData, setInitialData] = useState(null);
  const { getClassById, updateClassDetails } = useClassService();
  const combinations = ["A-LEVEL", "O-LEVEL"];

  // console.log("class Id is", classId);
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const clazz = await getClassById(classId);
        setInitialData({
          id: clazz.id,
          className: clazz.className || '',
          classType: clazz.classType || '',
          dateTime: dayjs(),
        });
      } catch (err) {
        console.error('Failed to load class data:', err);
      }
    };

    if (open && classId) {
      fetchClassData();
    }
  }, [open, classId]);

  // console.log("class data  are  is", initialData);

  const handleSave = async (values) => {
    try {
      const payload = {
        id: initialData.id,
        className: values.className,
        classType: values.classType,
      };

      await updateClassDetails(payload);
      onSuccess();
      onClose();
    } catch (error) {

    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>EDIT CLASS</DialogTitle>
      <DialogContent>
        {initialData && (
          <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={ClassSchema}
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
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="filled"
                      type="text"
                      label="Class Name"
                      name="className"
                      value={values.className}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.className && !!errors.className}
                      helperText={touched.className && errors.className}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Field name="classType">
                      {({ field, form }) => (
                        <Autocomplete
                          options={combinations}
                          value={field.value || ""}
                          onChange={(_, newValue) => form.setFieldValue("classType", newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Class Type"
                              variant="filled"
                              fullWidth
                              error={form.touched.classType && Boolean(form.errors.classType)}
                              helperText={form.touched.classType && form.errors.classType}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid>


                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Timestamp (optional)"
                        value={values.dateTime}
                        onChange={(newValue) => setFieldValue('dateTime', newValue)}
                        disableFuture
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
                <DialogActions>
                  <Button onClick={onClose} color="secondary" variant="contained">
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
