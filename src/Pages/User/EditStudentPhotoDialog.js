import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Grid,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Formik } from 'formik';
import useStudentService from '../../api/services/studentService';
import toast from 'react-hot-toast';

const EditStudentPictureDialog = ({ open, onClose, loadStudentData, studentId }) => {
  const [file, setFile] = useState(null);
  const { uploadStudentImage } = useStudentService();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>UPLOAD PROFILE IMAGE</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ file: null }}
          validate={(values) => {
            const errors = {};
            if (!values.file) {
              errors.file = 'File is required';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            if (file) {
              try {
                await uploadStudentImage(file, studentId); 
                toast.success('Profile picture updated successfully');
                loadStudentData();  
                onClose();
              } catch (error) {
                toast.error('Error updating profile picture');
                console.error('Upload error:', error);
              }
            } else {
              toast.error('Please select a file');
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setFieldValue('file', e.target.files[0]);
                    }}
                    style={{ marginTop: '10px' }}
                  />
                  {errors.file && touched.file && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{errors.file}</div>
                  )}
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={onClose} color="secondary" variant="contained">
                  Cancel
                </Button>
                <Button type="submit" color="secondary" variant="contained">
                  Upload
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentPictureDialog;
