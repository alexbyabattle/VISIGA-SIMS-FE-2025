import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  CircularProgress, 
  Box, 
  Typography 
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import useParentService from '../../api/services/ParentsService';
import { toast } from 'react-hot-toast';

const validationSchema = yup.object({
  parentName: yup.string().required('Parent name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

const EditParentDialog = ({ open, onClose, parentId, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState({
    parentName: '',
    email: '',
    phoneNumber: '',
    status: 'ACTIVE',
  });

  const { loadParentDetails, updateParentDetails } = useParentService();

  useEffect(() => {
    if (open && parentId) {
      loadParentData();
    }
  }, [open, parentId]);

  const loadParentData = async () => {
    setIsLoading(true);
    try {
      const parentData = await loadParentDetails(parentId);
      setInitialData({
        parentName: parentData.name || '',
        email: parentData.email || '',
        phoneNumber: parentData.phoneNumber || '',
        status: parentData.status || 'ACTIVE',
      });
    } catch (error) {
      console.error('Error loading parent data:', error);
      toast.error('Failed to load parent details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const updateParentDto = {
        id: parentId,
        studentParentId: parentId, // Backend expects this field for updates
        parentName: values.parentName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        status: values.status, // Preserve the status
      };

      await updateParentDetails(parentId, updateParentDto);
      toast.success("Parent details updated successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to update parent:', error);
      toast.error(error.response?.data?.message || 'Failed to update parent details');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>EDIT PARENT</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Loading parent details...
            </Typography>
          </Box>
        ) : (
          <Formik
            initialValues={initialData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting: formikSubmitting }) => (
              <Form>
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
                
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Parent Name"
                      name="parentName"
                      variant="filled"
                      value={values.parentName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.parentName && Boolean(errors.parentName)}
                      helperText={touched.parentName && errors.parentName}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      variant="filled"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      variant="filled"
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      disabled={isSubmitting}
                    />
                  </Grid>
                </Grid>
                
                <DialogActions sx={{ mt: 2 }}>
                  <Button 
                    onClick={handleClose} 
                    color="secondary" 
                    variant="contained" 
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary" 
                    disabled={isSubmitting || formikSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Parent'}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditParentDialog;