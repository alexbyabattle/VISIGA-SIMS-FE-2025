import React, { useState, useEffect } from 'react';
import {
  Box,
  useTheme,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { tokens } from '../../theme';
import { getUserFromCookies } from '../../utils/Cookie-utils';
import { useNavigate } from "react-router-dom";
import useTermService from '../../api/services/termService';
import Header from "../../components/Header";
import { Formik } from 'formik';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TermSchema } from '../../schemas/Schemas';


const EditDialog = ({ termId, open, onClose, onSuccess }) => {
  const [initialData, setInitialData] = useState(null);
  const { loadTermDetails, updateTermDetails } = useTermService();

  useEffect(() => {
    const fetchTermData = async () => {
      try {
        const term = await loadTermDetails(termId);
        setInitialData({
          id: term.id,
          termName: term.termName || '',
          createdAt: term.createdAt ? dayjs(term.createdAt) : dayjs(),
        });
      } catch (err) {
        console.error('Failed to load term data:', err);
      }
    };

    if (open && termId) {
      fetchTermData();
    }
  }, [open, termId]);

  const handleSave = async (values) => {
    try {
      const payload = {
        id: initialData.id,
        termName: values.termName,
        createdAt: values.createdAt,
      };

      await updateTermDetails(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update term:', error);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>EDIT TERM</DialogTitle>
      <DialogContent>
        {initialData && (
          <Formik
            enableReinitialize
            initialValues={initialData}
            validationSchema={TermSchema}
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
                      label="Term Name"
                      name="termName"
                      value={values.termName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.termName && !!errors.termName}
                      helperText={touched.termName && errors.termName}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Created At"
                        value={values.createdAt}
                        onChange={(newValue) => setFieldValue('createdAt', newValue)}
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
                    Save
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
