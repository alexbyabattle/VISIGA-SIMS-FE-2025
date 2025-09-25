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
  Grid,
  CircularProgress,
  Typography
} from '@mui/material';
import { Formik } from 'formik';
import useSubjectService from '../../api/services/SubjectService';
import { SubjectSchema } from '../../schemas/Schemas';
import { toast } from 'react-hot-toast';

const EditSubjectDialog = ({ subjectId, open, onClose, onSuccess }) => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loadSubjectDetails, updateSubjectDetails } = useSubjectService();

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!subjectId) return;
      
      setIsLoading(true);
      try {
        const subject = await loadSubjectDetails(subjectId);
        
        setInitialData({
          id: subject.id,
          subjectName: subject.subjectName || '',
          status: subject.status || 'ACTIVE',
        });
      } catch (err) {
        console.error('Failed to load subject data:', err);
        toast.error('Failed to load subject details');
      } finally {
        setIsLoading(false);
      }
    };

    if (open && subjectId) {
      fetchSubjectData();
    } else {
      setInitialData(null);
    }
  }, [open, subjectId]);

  const handleSave = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        id: values.id,
        subjectName: values.subjectName,
        status: values.status, 
      };

      await updateSubjectDetails(payload);
      toast.success("Subject updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update subject:', error);
      toast.error(error.response?.data?.message || 'Failed to update subject');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>EDIT SUBJECT</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : initialData ? (
          <Formik
            enableReinitialize
            initialValues={initialData}
            // validationSchema={SubjectSchema}
            onSubmit={handleSave}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting: formikSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
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
                <Grid container spacing={2} paddingTop={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Subject Name"
                      name="subjectName"
                      value={values.subjectName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.subjectName && !!errors.subjectName}
                      helperText={touched.subjectName && errors.subjectName}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                      >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                        
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <DialogActions sx={{ mt: 2 }}>
                  <Button 
                    onClick={onClose} 
                    color="" 
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="secondary" 
                    variant="contained"
                    disabled={isSubmitting || formikSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>No subject data available</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditSubjectDialog;
