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
  Alert,
  CircularProgress,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Formik } from 'formik';
import useStudentService from '../../api/services/studentService';
import toast from 'react-hot-toast';

const EditStudentPictureDialog = ({ open, onClose, loadStudentData, studentId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadStudentImage } = useStudentService();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!studentId) {
      setError('Student ID is missing');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await uploadStudentImage(file, studentId);
      toast.success('Profile picture updated successfully');
      loadStudentData();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>UPLOAD PROFILE IMAGE</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Select an image file (JPG, PNG, GIF) - Max size: 5MB
            </Typography>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ 
                marginTop: '10px',
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              disabled={uploading}
            />
          </Grid>
          
          {preview && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Preview:
                </Typography>
                <Avatar
                  src={preview}
                  sx={{ width: 100, height: 100, mx: 'auto' }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="secondary" 
            variant="outlined"
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="secondary" 
            variant="contained"
            disabled={!file || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentPictureDialog;
